const pool = require("../config/db");

const createContent = async (typeId, data) => {
  const result = await pool.query(
    "INSERT INTO contents (type_id, data) VALUES ($1, $2) RETURNING *",
    [typeId, JSON.stringify(data)]
  );
  return result.rows[0];
};

const getContentByType = async (typeId) => {
  const result = await pool.query(
    "SELECT * FROM contents WHERE type_id = $1 ORDER BY created_at DESC",
    [typeId]
  );
  return result.rows;
};

module.exports = { createContent, getContentByType };
