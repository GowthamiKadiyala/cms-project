const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// IN REAL LIFE: Put this secret in .env!
const JWT_SECRET = "my_super_secret_sde3_key";

// 1. Register Logic
const registerUser = async (username, email, password) => {
  // Scramble password (10 rounds of salt)
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // Save to DB
  const result = await pool.query(
    "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
    [username, email, hash]
  );
  return result.rows[0];
};

// 2. Login Logic
const loginUser = async (email, password) => {
  // Find user
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = result.rows[0];

  if (!user) throw new Error("User not found");

  // Check password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error("Wrong password");

  // Create Wristband (Token) valid for 1 hour
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

  return { user, token };
};

module.exports = { registerUser, loginUser };
