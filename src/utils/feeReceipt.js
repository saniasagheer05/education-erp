import { Alert } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
const escapeHtml=(v)=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const inr=(v)=>`Rs. ${Number(v||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const formatDate=(v)=>!v?"-":new Date(v).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
export function buildReceiptHtml({student,fee}) {
  const name=`${student.first_name||""} ${student.last_name||""}`.trim(); const today=formatDate(new Date()); const receiptNo=`RCPT-${String(fee.id).padStart(5,"0")}`;
  const row=(l,v)=>`<tr><td class="label">${escapeHtml(l)}</td><td>${escapeHtml(v)}</td></tr>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
  body{font-family:Helvetica,Arial,sans-serif;color:#111827;padding:32px}.header{text-align:center;border-bottom:2px solid #2F5FCF;padding-bottom:14px}
  .header h1{margin:0;font-size:20px;color:#2F5FCF}.header p{margin:4px 0 0;font-size:12px;color:#6B7280}h2{text-align:center;letter-spacing:2px;font-size:16px;margin:22px 0 6px}
  .meta{display:flex;justify-content:space-between;font-size:12px;color:#6B7280;margin-bottom:18px}table{width:100%;border-collapse:collapse;margin-bottom:18px}
  td{padding:9px 10px;border:1px solid #E5E7EB;font-size:13px}td.label{width:40%;background:#F8F9FB;font-weight:600}.section{font-size:13px;font-weight:700;margin:16px 0 6px;color:#2F5FCF}
  .status{display:inline-block;padding:3px 10px;border-radius:10px;background:#EAF0FE;color:#2F5FCF;font-weight:700;font-size:12px}.footer{margin-top:30px;font-size:11px;color:#6B7280;text-align:center}
  </style></head><body><div class="header"><h1>Sri Venkateshwara College of Engineering</h1><p>Accounts Office</p></div><h2>FEE RECEIPT</h2>
  <div class="meta"><span>Receipt No: ${escapeHtml(receiptNo)}</span><span>Date: ${escapeHtml(today)}</span></div>
  <div class="section">Student Details</div><table>${row("Name",name)}${row("Library ID",student.library_id)}${student.usn?row("USN",student.usn):""}${row("Department",student.department)}</table>
  <div class="section">Payment Details</div><table>${row("Semester",fee.semester)}${row("Academic Year",fee.academic_year)}${row("Total Fee",inr(fee.total_amount))}${row("Amount Paid",inr(fee.paid_amount))}${row("Balance Due",inr(fee.due_amount))}${row("Due Date",formatDate(fee.due_date))}<tr><td class="label">Status</td><td><span class="status">${escapeHtml(fee.status)}</span></td></tr></table>
  <div class="footer">This is a computer-generated receipt and does not require a signature.</div></body></html>`;
}
export async function shareFeeReceipt({student,fee}) {
  try {
    if (!student||!fee) throw new Error("Missing student or fee details.");
    if (!(parseFloat(fee.paid_amount)>0)) { Alert.alert("No payment yet","A receipt is available once a payment has been recorded."); return; }
    const html=buildReceiptHtml({student,fee}); const { uri } = await Print.printToFileAsync({ html });
    let fileUri=uri;
    try { const safeId=String(student.library_id||"student").replace(/[^A-Za-z0-9_-]/g,""); const target=`${FileSystem.cacheDirectory}Receipt_${safeId}_Sem${fee.semester}.pdf`;
      await FileSystem.deleteAsync(target,{idempotent:true}); await FileSystem.moveAsync({from:uri,to:target}); fileUri=target; } catch(e){}
    if (!(await Sharing.isAvailableAsync())) { Alert.alert("Receipt created", `Saved to: ${fileUri}`); return; }
    await Sharing.shareAsync(fileUri, { mimeType:"application/pdf", dialogTitle:"Fee receipt", UTI:"com.adobe.pdf" });
  } catch(err) { Alert.alert("Could not create receipt", err.message || "Please try again."); }
}
