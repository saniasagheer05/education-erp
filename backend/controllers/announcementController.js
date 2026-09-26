const Announcement = require("../models/Announcement");
const PushToken = require("../models/PushToken");
const asyncHandler = require("../utils/asyncHandler");
const { sendPushToRole, isExpoPushToken } = require("../utils/pushNotifications");
const { validateAnnouncement, validatePushToken } = require("../utils/validators");
const createAnnouncement = asyncHandler(async (req,res) => {
  const errors = validateAnnouncement(req.body);
  if (errors.length>0) return res.status(400).json({success:false,message:"Validation failed",errors});
  const a = await Announcement.create({title:req.body.title.trim(),body:req.body.body.trim(),createdBy:req.user.id});
  res.status(201).json({success:true,message:"Announcement published",data:a});
  sendPushToRole("student",{title:a.title,body:a.body.length>140?`${a.body.slice(0,137)}...`:a.body,data:{type:"announcement",id:a.id}});
});
const listAnnouncementsAdmin = asyncHandler(async (req,res) => { const data=await Announcement.findAll(); res.status(200).json({success:true,count:data.length,data}); });
const deleteAnnouncement = asyncHandler(async (req,res) => {
  const id=Number(req.params.id); if(!Number.isInteger(id)||id<1) return res.status(400).json({success:false,message:"Invalid announcement id"});
  const d=await Announcement.remove(id); if(!d) return res.status(404).json({success:false,message:"Announcement not found"});
  res.status(200).json({success:true,message:"Announcement deleted"});
});
const listAnnouncementsStudent = asyncHandler(async (req,res) => { const data=await Announcement.findAll(); res.status(200).json({success:true,count:data.length,data}); });
const registerPushToken = asyncHandler(async (req,res) => {
  const errors=validatePushToken(req.body,isExpoPushToken); if(errors.length>0) return res.status(400).json({success:false,message:"Validation failed",errors});
  if(req.user.role!=="admin"&&req.user.role!=="student") return res.status(403).json({success:false,message:"Unsupported role"});
  await PushToken.upsert({userId:req.user.id,role:req.user.role,token:req.body.token.trim()});
  res.status(200).json({success:true,message:"Push token saved"});
});
module.exports = { createAnnouncement, listAnnouncementsAdmin, deleteAnnouncement, listAnnouncementsStudent, registerPushToken };
