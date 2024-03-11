import dotenv from 'dotenv';
dotenv.config();

import { Redis } from 'ioredis';

if (!process.env.REDIS_URL) {
  throw new Error('Missing REDIS_URL in environment');
}

const redis = new Redis(process.env.REDIS_URL!);

function getPrefix(banner: string) {
  switch (banner) {
    case 'global':
      return 'gacha:';
    case 'jp':
      return 'gacha_jp:';
    default:
      throw new Error('Invalid banner');
  }
}

async function resetForBanner(banner: string) {
  if (!['global', 'jp'].includes(banner)) {
    throw new Error('Invalid banner');
  }

  const prefix = getPrefix(banner);

  const keys = await redis.keys(`${prefix}*`);
  const pipeline = redis.pipeline();

  keys.forEach((key) => {
    pipeline.set(key, '0');
  });

  await pipeline.exec();

  console.log(`Reset recruitment points for ${banner}.`);
}

async function resetRecruitmentPoints() {
  const banner = process.argv[2];

  if (!banner) {
    throw new Error('Banner not specified');
  }

  await resetForBanner(banner);
}

resetRecruitmentPoints()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
