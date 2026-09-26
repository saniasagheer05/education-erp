const { query } = require("../config/db");
const upsert = async ({userId,role,token}) => (await query(`INSERT INTO push_tokens (user_id,role,token) VALUES ($1,$2,$3) ON CONFLICT (token) DO UPDATE SET user_id=EXCLUDED.user_id, role=EXCLUDED.role RETURNING id,user_id,role,token,created_at`,[userId,role,token])).rows[0];
const findByRole = async (role) => (await query(`SELECT token FROM push_tokens WHERE role=$1`,[role])).rows.map(r=>r.token);
const removeTokens = async (tokens) => { if (!tokens||tokens.length===0) return; await query(`DELETE FROM push_tokens WHERE token = ANY($1::text[])`,[tokens]); };
module.exports = { upsert, findByRole, removeTokens };
