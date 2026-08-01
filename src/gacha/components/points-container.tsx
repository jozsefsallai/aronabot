import React from "react";
import { GACHA_POINTS_ICON_BUFFER } from "../preloaded-buffers";

export interface PointsContainerProps {
  points: number;
}

export const PointsContainer = ({ points }: PointsContainerProps) => {
  return (
    <div
      // points-container
      style={{
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: 55,
        bottom: 47,
      }}
    >
      <div
        // points
        style={{
          display: "flex",
          flexDirection: "column",
          width: 150,
          height: 54,
          transform: "skewX(-10deg)",
          background: "#245a7e",
          border: "1px solid #245a7e",
          borderRadius: 3,
          marginLeft: -17,
          color: "#4b709b",
          fontSize: 18,
          fontWeight: 700,
          fontFamily: "NotoSans",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 2,
            width: 146,
            height: 24,
            background: "white",
            transform: "skewX(-10deg)",
          }}
        />

        <div
          // points-text
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50%",
            fontSize: 13,
            transform: "skewX(10deg)",
          }}
        >
          Recruitment Points
        </div>

        <div
          // points-count.point
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50%",
            color: "white",
            transform: "skewX(10deg)",
          }}
        >
          {points}
        </div>
      </div>

      <img
        // points-icon
        alt=""
        src={GACHA_POINTS_ICON_BUFFER}
        style={{
          width: 57,
        }}
      />
    </div>
  );
};
