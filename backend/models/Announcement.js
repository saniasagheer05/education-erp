const { query } = require("../config/db");
const findAll = async (limit=50) => (await query(`SELECT a.id,a.title,a.body,a.created_by,a.created_at,ad.name AS created_by_name FROM announcements a LEFT JOIN admins ad ON ad.id=a.created_by ORDER BY a.created_at DESC LIMIT $1`,[limit])).rows;
const create = async ({title,body,createdBy}) => (await query(`INSERT INTO announcements (title,body,created_by) VALUES ($1,$2,$3) RETURNING id,title,body,created_by,created_at`,[title,body,createdBy])).rows[0];
const remove = async (id) => (await query(`DELETE FROM announcements WHERE id=$1 RETURNING id`,[id])).rows[0] || null;
module.exports = { findAll, create, remove };
