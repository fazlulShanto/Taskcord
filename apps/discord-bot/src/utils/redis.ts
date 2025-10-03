import { Redis } from "ioredis";

const CreateRedisClient = (redisUrl: string | undefined) => {
  if (!redisUrl) {
    throw new Error(`Invalid redis url`);
  }
  const valkey = new Redis(redisUrl);

  valkey.on("error", (err) => {
    console.error("Redis error", err);
  });

  valkey.on("ready", () => {
    console.log("✅ Redis connected successfully.");
  });

  return valkey;
};

export { CreateRedisClient, type Redis };
