import type { IConfig } from "./IConfig";

import * as path from "node:path";

import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const requiredEnvVars = ["BOT_TOKEN", "BOT_CLIENT_ID", "OWNER_ID"];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

const config: IConfig = {
  bot: {
    token: process.env.BOT_TOKEN as string,
    clientId: process.env.BOT_CLIENT_ID as string,
    defaultActivity: process.env.BOT_DEFAULT_ACTIVITY,
    ownerId: process.env.OWNER_ID as string,
    staffIds: process.env.STAFF_IDS?.split(",").map((id) => id.trim()) ?? [],
  },
  isMaintenance: process.env.IS_MAINTENANCE === "true",
};

if (process.env.REDIS_URL) {
  config.redis = {
    url: process.env.REDIS_URL,
  };
}

export default config;
