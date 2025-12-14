const pool = require("../config/db");

const createType = async (name, fields) => {
  const result = await pool.query(
    "INSERT INTO content_types (name, fields) VALUES ($1, $2) RETURNING *",
    [name, JSON.stringify(fields)]
  );
  return result.rows[0];
};

const getAllTypes = async () => {
  const result = await pool.query("SELECT * FROM content_types");
  return result.rows;
};

module.exports = { createType, getAllTypes };
