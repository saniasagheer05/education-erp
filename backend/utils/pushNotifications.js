const PushToken = require("../models/PushToken");
const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"; const BATCH_SIZE = 100;
const isExpoPushToken = (t) => /^(ExponentPushToken|ExpoPushToken)\[.+\]$/.test(String(t||""));
const chunk = (a,s) => { const o=[]; for(let i=0;i<a.length;i+=s) o.push(a.slice(i,i+s)); return o; };
const sendPushToRole = async (role,{title,body,data={}}) => {
  try {
    const tokens = (await PushToken.findByRole(role)).filter(isExpoPushToken);
    if (tokens.length===0) return;
    const invalid=[];
    for (const batch of chunk(tokens,BATCH_SIZE)) {
      try {
        const messages = batch.map(to=>({to,sound:"default",title,body,data,channelId:"default"}));
        const r = await fetch(EXPO_PUSH_URL,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(messages)});
        const result = await r.json(); const tickets = Array.isArray(result.data)?result.data:[];
        tickets.forEach((t,i)=>{ if(t.status==="error"&&t.details&&t.details.error==="DeviceNotRegistered") invalid.push(batch[i]); });
      } catch(e){ console.error("Push batch failed:",e.message); }
    }
    await PushToken.removeTokens(invalid);
  } catch(e){ console.error("Push notification error:",e.message); }
};
module.exports = { sendPushToRole, isExpoPushToken };
