import { IConfig } from './IConfig';

import * as path from 'path';

import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnvVars = ['BOT_TOKEN', 'BOT_CLIENT_ID', 'OWNER_ID'];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

const config: IConfig = {
  bot: {
    token: process.env.BOT_TOKEN!,
    clientId: process.env.BOT_CLIENT_ID!,
    defaultActivity: process.env.BOT_DEFAULT_ACTIVITY,
    ownerId: process.env.OWNER_ID!,
    staffIds: process.env.STAFF_IDS?.split(',').map((id) => id.trim()) ?? [],
  },
  isMaintenance: process.env.IS_MAINTENANCE === 'true',
  isChroma: process.env.IS_CHROMA === 'true',
};

if (process.env.REDIS_URL) {
  config.redis = {
    url: process.env.REDIS_URL,
  };
}

export default config;
