const bcrypt=require("bcrypt"); const { pool } = require("../config/db");
const [email,password,name="Administrator"]=process.argv.slice(2);
const main = async () => {
  if (!email||!password) { console.error('Usage: npm run create-admin -- <email> "<password>" ["<name>"]'); process.exitCode=1; return; }
  if (password.length<8) { console.error("Password must be at least 8 characters."); process.exitCode=1; return; }
  const hash=await bcrypt.hash(password,10);
  const r = await pool.query(`INSERT INTO admins (name,email,password_hash,role) VALUES ($1,$2,$3,'admin') ON CONFLICT (email) DO UPDATE SET password_hash=EXCLUDED.password_hash RETURNING id,email`,[name,email.trim().toLowerCase(),hash]);
  console.log(`Admin ready: ${r.rows[0].email} (id ${r.rows[0].id})`);
};
main().catch(e=>{console.error("Failed:",e.message); process.exitCode=1;}).finally(()=>pool.end());
