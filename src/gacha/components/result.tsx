import React from "react";

import { Card, type CardProps } from "./card";
import { CardShadow } from "./card-shadow";
import { GACHA_BG_BUFFER } from "../preloaded-buffers";
import { PointsContainer } from "./points-container";
import type { BannerKind } from "../../db/client";

export interface GachaResultProps {
  cards: CardProps[];
  bannerKind?: BannerKind;
  points?: number;
}

export const GachaResult = ({ cards, points }: GachaResultProps) => {
  return (
    <div
      // gacha-result
      style={{
        overflow: "hidden",
        width: 1120,
        height: 640,
        backgroundSize: "cover",
        position: "relative",
        display: "flex",
        background: `url(${GACHA_BG_BUFFER})`,
      }}
    >
      <div
        // shadow-container
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 530,
          width: 1120,
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          flexWrap: "wrap",
          padding: "0 190px",
        }}
      >
        {cards.map((card, i) => (
          <CardShadow rarity={card.student.rarity} key={i} />
        ))}
      </div>

      <div
        // card-container
        style={{
          height: 570,
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          flexWrap: "wrap",
          padding: "0 190px",
        }}
      >
        {cards.map((card, i) => (
          <Card {...card} key={i} />
        ))}
      </div>

      {points && <PointsContainer points={points} />}
    </div>
  );
};
