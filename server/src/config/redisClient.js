const redis = require("redis");

// 1. Create the client
const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
// 2. Handle Errors (Important for SDE 3: Never let the app crash if Cache fails)
client.on("error", (err) => console.log("Redis Client Error", err));

// 3. Connect immediately
(async () => {
  await client.connect();
  console.log("✅ Connected to Redis Cache");
})();

module.exports = client;
