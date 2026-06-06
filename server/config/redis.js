const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  lazyConnect: true,
  retryStrategy: (times) => {
    if (times > 3) {
      console.warn("Redis unavailable, running without cache.");
      return null; // Stop retrying — app works without Redis
    }
    return Math.min(times * 200, 1000);
  },
});

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.warn("⚠️  Redis error:", err.message));

module.exports = redis;
