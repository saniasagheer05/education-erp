const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Fee = require("../models/Fee");
const Timetable = require("../models/Timetable");
const Stats = require("../models/Stats");
const asyncHandler = require("../utils/asyncHandler");
const loadStudent = async (req,res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)||id<1) { res.status(400).json({success:false,message:"Invalid student id"}); return null; }
  const student = await Student.findById(id);
  if (!student) { res.status(404).json({success:false,message:"Student not found"}); return null; }
  return student;
};
const getStats = asyncHandler(async (req,res) => { const data = await Stats.getOverview(); res.status(200).json({success:true,data}); });
const getDefaulters = asyncHandler(async (req,res) => {
  const { department, semester } = req.query;
  const data = await Fee.findDefaulters({department,semester});
  const totalDue = data.reduce((s,r)=>s+parseFloat(r.due_amount||0),0);
  res.status(200).json({success:true,count:data.length,totalDue,data});
});
const getStudentFeesAdmin = asyncHandler(async (req,res) => { const s=await loadStudent(req,res); if(!s) return; const data=await Fee.findByStudentId(s.id); res.status(200).json({success:true,data}); });
const getStudentAttendanceAdmin = asyncHandler(async (req,res) => {
  const s=await loadStudent(req,res); if(!s) return;
  const [records,summary]=await Promise.all([Attendance.findByStudentId(s.id,{}), Attendance.getSummaryByStudentId(s.id)]);
  res.status(200).json({success:true,data:{records,summary}});
});
const getStudentTimetableAdmin = asyncHandler(async (req,res) => {
  const s=await loadStudent(req,res); if(!s) return;
  const timetable=await Timetable.findByDeptSemSection(s.department,s.semester,s.section);
  res.status(200).json({success:true,data:{student:{id:s.id,department:s.department,semester:s.semester,section:s.section},timetable}});
});
module.exports = { getStats, getDefaulters, getStudentFeesAdmin, getStudentAttendanceAdmin, getStudentTimetableAdmin };
