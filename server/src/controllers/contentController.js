const contentService = require("../services/contentService");
const redisClient = require("../config/redisClient");

const createContent = async (req, res) => {
  try {
    const { typeId, data } = req.body;
    const content = await contentService.createContent(typeId, data);
    res.status(201).json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getContent = async (req, res) => {
  try {
    const { typeId } = req.params;
    const cacheKey = `contents:${typeId}`;

    // 1. Check Redis (Fast Lane)
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("⚡ HIT: Serving from Redis Cache");
      return res.json(JSON.parse(cachedData));
    }

    // 2. If Miss, Check Database (Slow Lane)
    console.log("🐢 MISS: Fetching from Database");
    const contents = await contentService.getContentByType(typeId);

    // 3. Save to Redis for next time (Expires in 60 seconds)
    await redisClient.setEx(cacheKey, 60, JSON.stringify(contents));

    res.json(contents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createContent, getContent };
