import * as fs from "node:fs";
import * as path from "node:path";
import { localFileToDataUri } from "../utils/localFileToDataUri";

const IMAGE_ASSETS_DIR = path.join(__dirname, "../..", "assets/images");

export const GACHA_BG_BUFFER = localFileToDataUri(
  "image",
  path.join(IMAGE_ASSETS_DIR, "gacha", "background.png"),
);
export const GACHA_CHARA_CARD_BG_BUFFER = localFileToDataUri(
  "image",
  path.join(IMAGE_ASSETS_DIR, "gacha", "chara-card-bg.png"),
);
export const GACHA_PICKUP_BUFFER = localFileToDataUri(
  "image",
  path.join(IMAGE_ASSETS_DIR, "gacha", "pickup.png"),
);
export const GACHA_POINTS_ICON_BUFFER = localFileToDataUri(
  "image",
  path.join(IMAGE_ASSETS_DIR, "gacha", "points-icon.png"),
);
export const GACHA_STAR_BUFFER = localFileToDataUri(
  "image",
  path.join(IMAGE_ASSETS_DIR, "gacha", "star.png"),
);

const FONT_ASSETS_DIR = path.join(__dirname, "../..", "assets/fonts");

export const NOTOSANS_400_BYTES = fs.readFileSync(
  path.join(FONT_ASSETS_DIR, "notosans-400.ttf"),
);

export const NOTOSANS_700_BYTES = fs.readFileSync(
  path.join(FONT_ASSETS_DIR, "notosans-700.ttf"),
);
