import React from "react";

import { Card, type CardProps } from "./card";
import { CardShadow } from "./card-shadow";
import { GACHA_BG_BUFFER } from "../preloaded-buffers";
import { PointsContainer } from "./points-container";
import type {
  BannerChargeCategory,
  BannerCounterKind,
  BannerKind,
  Student,
} from "../../db/client";
import { ChargeContainer } from "./charge-container";

export interface GachaResultProps {
  cards: CardProps[];
  bannerKind?: BannerKind;
  type?: BannerCounterKind;
  points?: number;
  charge?: number;
  pickupStudent?: Student;
  bannerChargeCategory?: BannerChargeCategory;
}

export const GachaResult = ({
  cards,
  type = "Points",
  points,
  charge,
  pickupStudent,
  bannerChargeCategory,
}: GachaResultProps) => {
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
        transform: "scale(2) translate(25%, 25%)",
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

      {type === "Points" && points && <PointsContainer points={points} />}

      {type === "Charge" && charge != null && (
        <ChargeContainer
          charge={charge}
          pickupStudent={pickupStudent}
          bannerChargeCategory={bannerChargeCategory}
        />
      )}
    </div>
  );
};
