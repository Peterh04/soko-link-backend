// config/redis.js
import { createClient } from "redis";

const redisURL = process.env.REDIS_URL;

let redisClient = null;

if (!redisURL) {
  console.log("⚠️ REDIS_URL not set. Redis will not connect.");
} else {
  redisClient = createClient({ url: redisURL });

  redisClient.on("error", (err) => {
    console.log("Redis Error:", err);
  });

  // Use async IIFE to allow await
  (async () => {
    try {
      await redisClient.connect();
      console.log("✅ Connected to Redis");
    } catch (err) {
      console.log("❌ Failed to connect to Redis:", err);
    }
  })();
}

export default redisClient;
