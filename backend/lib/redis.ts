import Redis from "ioredis";
import "dotenv/config";

const redis = new Redis(String(process.env.REDIS_URL));

export default redis;
