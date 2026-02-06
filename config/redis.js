import { createClient } from "redis";

console.log("REDIS_URL:", process.env.REDIS_URL);
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err);
});

await redisClient.connect();

export default redisClient;
