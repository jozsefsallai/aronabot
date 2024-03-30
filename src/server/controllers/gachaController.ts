import { Request, Response } from 'express';

import { bannerContainer } from '../../containers/banners';
import { Student } from '../../models/Student';
import { Rarity } from '../../models/Rarity';
import { iconsContainer } from '../../containers/icons';

import * as path from 'path';
import { localFileToDataUri } from '../../utils/localFileToDataUri';

const IMAGE_ASSETS_DIR = path.join(__dirname, '../../..', 'assets/images');

const GACHA_BG_BUFFER = localFileToDataUri(
  'image',
  path.join(IMAGE_ASSETS_DIR, 'gacha', 'background.png'),
);
const GACHA_CHARA_CARD_BG_BUFFER = localFileToDataUri(
  'image',
  path.join(IMAGE_ASSETS_DIR, 'gacha', 'chara-card-bg.png'),
);
const GACHA_PICKUP_BUFFER = localFileToDataUri(
  'image',
  path.join(IMAGE_ASSETS_DIR, 'gacha', 'pickup.png'),
);
const GACHA_POINTS_ICON_BUFFER = localFileToDataUri(
  'image',
  path.join(IMAGE_ASSETS_DIR, 'gacha', 'points-icon.png'),
);
const GACHA_STAR_BUFFER = localFileToDataUri(
  'image',
  path.join(IMAGE_ASSETS_DIR, 'gacha', 'star.png'),
);

interface Card {
  key: string;
  student: Student;
  isPickup: boolean;
  icon: string;
}

export function get(req: Request, res: Response) {
  const bannerId = (req.query.banner ?? 'regular') as string;
  const points = req.query.points && parseInt(req.query.points as string, 10);
  const erode = req.query.erode === 'true';

  const banner = bannerContainer.getBanner(bannerId);

  if (!banner) {
    res.status(404).send('Banner not found!');
    return;
  }

  const cards: Card[] = [];

  try {
    const students = banner.pullTen();

    for (const [student, key] of students) {
      const icon = iconsContainer.getIcon(key);

      cards.push({
        key,
        student,
        isPickup: banner.isPickup(key),
        icon: icon ?? '',
      });
    }
  } catch (err: any) {
    res.status(500).send(err.message);
    return;
  }

  res.render('gacha', {
    cards,
    points: points && !isNaN(points) ? points : undefined,
    erode,
    assets: {
      bg: GACHA_BG_BUFFER,
      charaCardBg: GACHA_CHARA_CARD_BG_BUFFER,
      pickup: GACHA_PICKUP_BUFFER,
      pointsIcon: GACHA_POINTS_ICON_BUFFER,
      star: GACHA_STAR_BUFFER,
    },
  });
}

export function simulate(req: Request, res: Response) {
  const bannerId = (req.query.banner ?? 'regular') as string;
  const count =
    (req.query.count && parseInt(req.query.count as string, 10)) || 10;
  const pullsPerSimulation =
    (req.query.pullsPerSimulation &&
      parseInt(req.query.pullsPerSimulation as string, 10)) ||
    1000;

  const banner = bannerContainer.getBanner(bannerId);

  if (!banner) {
    res.status(404).send('Banner not found!');
    return;
  }

  const results = [];

  for (let i = 0; i < count; i++) {
    let oneStarCount = 0;
    let twoStarCount = 0;
    let threeStarCount = 0;

    try {
      for (let i = 0; i < pullsPerSimulation; ++i) {
        const students = banner.pullTen();

        for (const [student, _] of students) {
          if (student.rarity === Rarity.OneStar) {
            oneStarCount++;
          } else if (student.rarity === Rarity.TwoStar) {
            twoStarCount++;
          } else if (student.rarity === Rarity.ThreeStar) {
            threeStarCount++;
          }
        }
      }
    } catch (err: any) {
      res.status(500).send(err.message);
      return;
    }

    const oneStarRate = oneStarCount / pullsPerSimulation;
    const twoStarRate = twoStarCount / pullsPerSimulation;
    const threeStarRate = threeStarCount / pullsPerSimulation;

    results.push({
      oneStarCount,
      twoStarCount,
      threeStarCount,

      oneStarRate,
      twoStarRate,
      threeStarRate,
    });
  }

  const summary = {
    oneStarCount: 0,
    twoStarCount: 0,
    threeStarCount: 0,

    oneStarRate: 0,
    twoStarRate: 0,
    threeStarRate: 0,
  };

  for (const result of results) {
    summary.oneStarCount += result.oneStarCount;
    summary.twoStarCount += result.twoStarCount;
    summary.threeStarCount += result.threeStarCount;
  }

  summary.oneStarRate = summary.oneStarCount / (count * pullsPerSimulation);
  summary.twoStarRate = summary.twoStarCount / (count * pullsPerSimulation);
  summary.threeStarRate = summary.threeStarCount / (count * pullsPerSimulation);

  res.json({
    bannerId,
    count,
    pullsPerSimulation,
    results,
    summary,
  });
}
