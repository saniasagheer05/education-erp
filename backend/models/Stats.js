const { query } = require("../config/db");
const pct = (p,t) => (t>0 ? Math.round((p/t)*1000)/10 : 0);
const getOverview = async () => {
  const [students, byDept, attendance, attByDept, fees, feeStatus] = await Promise.all([
    query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status='Active')::int AS active, COUNT(*) FILTER (WHERE status='Suspended')::int AS suspended FROM students`),
    query(`SELECT department, COUNT(*)::int AS count FROM students GROUP BY department ORDER BY count DESC, department`),
    query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status='Present')::int AS present FROM attendance`),
    query(`SELECT s.department, COUNT(a.id)::int AS total, COUNT(a.id) FILTER (WHERE a.status='Present')::int AS present FROM students s JOIN attendance a ON a.student_id=s.id GROUP BY s.department ORDER BY s.department`),
    query(`SELECT COALESCE(SUM(total_amount),0)::float AS total, COALESCE(SUM(paid_amount),0)::float AS paid, COALESCE(SUM(due_amount),0)::float AS due FROM fees`),
    query(`SELECT status, COUNT(*)::int AS count FROM fees GROUP BY status ORDER BY status`),
  ]);
  const att = attendance.rows[0];
  return {
    students: { total: students.rows[0].total, active: students.rows[0].active, suspended: students.rows[0].suspended, byDepartment: byDept.rows },
    attendance: { overallPercentage: pct(att.present, att.total), totalRecords: att.total, byDepartment: attByDept.rows.map(r=>({department:r.department, percentage:pct(r.present,r.total)})) },
    fees: { totalAmount: fees.rows[0].total, totalPaid: fees.rows[0].paid, totalDue: fees.rows[0].due, byStatus: feeStatus.rows },
  };
};
module.exports = { getOverview };
