const pool = require("../config/db");

// This function only talks to the database. It knows nothing about HTTP/Express.
const fetchAllUsers = async () => {
  const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
  return result.rows;
};

module.exports = { fetchAllUsers };
