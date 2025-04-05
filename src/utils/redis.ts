import Redis from "ioredis";
import config from "../config";

const redis = config.redis ? new Redis(config.redis.url) : undefined;
export default redis;
