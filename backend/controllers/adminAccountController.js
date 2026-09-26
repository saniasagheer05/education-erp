const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const asyncHandler = require("../utils/asyncHandler");
const { validateChangePassword } = require("../utils/validators");
const changePassword = asyncHandler(async (req,res) => {
  const errors = validateChangePassword(req.body);
  if (errors.length>0) return res.status(400).json({success:false,message:"Validation failed",errors});
  const admin = await Admin.findByEmail(req.user.email);
  if (!admin) return res.status(404).json({success:false,message:"Admin account not found"});
  const isMatch = await bcrypt.compare(req.body.currentPassword, admin.password_hash);
  if (!isMatch) return res.status(401).json({success:false,message:"Current password is incorrect"});
  const newHash = await bcrypt.hash(req.body.newPassword, 10);
  await Admin.updatePassword(admin.id, newHash);
  res.status(200).json({success:true,message:"Password updated successfully"});
});
module.exports = { changePassword };
