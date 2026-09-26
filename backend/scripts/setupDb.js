const fs=require("fs"); const path=require("path"); const { pool } = require("../config/db");
const args=process.argv.slice(2); const withSchema=args.includes("--with-schema"); const withSeed=args.includes("--with-seed");
const dbDir=path.join(__dirname,"..","database"); const migrationsDir=path.join(dbDir,"migrations");
const applyFile = async (f) => { await pool.query(fs.readFileSync(f,"utf8")); console.log(`  applied ${path.relative(dbDir,f)}`); };
const main = async () => {
  console.log(`Target database: ${process.env.DATABASE_URL ? "DATABASE_URL" : `${process.env.DB_HOST||"localhost"}/${process.env.DB_NAME||"svce_erp"}`}`);
  if (withSchema) { console.log("WARNING: --with-schema drops and recreates all tables."); await pool.query("DROP TABLE IF EXISTS announcements, push_tokens CASCADE"); await applyFile(path.join(dbDir,"schema.sql")); }
  if (fs.existsSync(migrationsDir)) for (const f of fs.readdirSync(migrationsDir).filter(f=>f.endsWith(".sql")).sort()) await applyFile(path.join(migrationsDir,f));
  if (withSeed) { await applyFile(path.join(dbDir,"seed.sql")); console.log("Demo data loaded."); }
  console.log("Done.");
};
main().catch(e=>{console.error("Database setup failed:",e.message); process.exitCode=1;}).finally(()=>pool.end());
