import React from "react";
import type { Student } from "../../db/client";
import {
  GACHA_CHARA_CARD_BG_BUFFER,
  GACHA_MILESTONE_100_ICON_BUFFER,
} from "../preloaded-buffers";

const MAX_CHARGE = 200;
const MID_MILESTONE = 100;
const BAR_WIDTH = 190;
const ICON_SIZE = 56;
const ACCENT = "#fc54d8";
const TRACK = "#d4d4d4";
const TRACK_ACCENT = "#ff8ae5";
const LABEL_BORDER = "#a8a9ab";
const LABEL_TEXT = "#858585";
const FOOTER = "#4d7289";
const BAR_TOP = 68;
const LABEL_HEIGHT = 18;

const MILESTONES = [MID_MILESTONE, MAX_CHARGE] as const;

export interface ChargeContainerProps {
  charge: number;
  pickupStudent?: Student;
}

function Milestone({
  value,
  iconUrl,
}: {
  value: number;
  iconUrl?: string;
}) {
  const leftPercent = (value / MAX_CHARGE) * 100;

  return (
    <div
      style={{
        position: "absolute",
        left: `${leftPercent}%`,
        top: 0,
        bottom: 0,
        width: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: -ICON_SIZE / 2 + 4,
          width: ICON_SIZE,
          height: ICON_SIZE,
          borderRadius: 8,
          border: "1px solid #717479",
          borderBottomWidth: 3,
          background: "#F7F8FA",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "skewX(-10deg)",
          zIndex: 10,
        }}
      >
        <div
          // icon-container::before
          style={{
            position: "absolute",
            top: -12,
            left: -4,
            width: ICON_SIZE + 4,
            height: ICON_SIZE,
            backgroundImage: `url(${GACHA_CHARA_CARD_BG_BUFFER})`,
            backgroundSize: `${ICON_SIZE + 4}px ${ICON_SIZE}px`,
            transform: "skewX(10deg)",
            opacity: 0.5,
          }}
        />

        {iconUrl && (
          <img
            alt=""
            src={iconUrl}
            style={{
              width: ICON_SIZE,
              height: ICON_SIZE,
              objectFit: "cover",
              transform: "skewX(10deg)",
            }}
          />
        )}

        {!iconUrl && (
          <img
            alt=""
            src={GACHA_MILESTONE_100_ICON_BUFFER}
            style={{
              width: ICON_SIZE,
              height: ICON_SIZE,
              objectFit: "cover",
              transform: "skewX(10deg)",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            right: 2,
            bottom: 1,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "NotoSans",
            color: "#2d4663",
            lineHeight: 1,
            textShadow: "0 0 2px #fff, 0 0 2px #fff",
          }}
        >
          x1
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: -4,
          bottom: 38,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            background: "#717479",
            transform: "rotate(45deg)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: -15,
          width: 30,
          height: LABEL_HEIGHT,
          borderRadius: 8,
          border: `1px solid ${LABEL_BORDER}`,
          background: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 700,
          fontFamily: "NotoSans",
          color: LABEL_TEXT,
          zIndex: 10,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function ChargeContainer({
  charge,
  pickupStudent,
}: ChargeContainerProps) {
  const fillRatio = Math.min(Math.max(charge, 0) / MAX_CHARGE, 1);
  const fillPercent = fillRatio * 100;
  const iconUrl = pickupStudent
    ? `https://aronabot.cdn.nimblebun.works/v2/images/students/icons/${pickupStudent.id}.png`
    : undefined;

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        bottom: 16,
        width: BAR_WIDTH + 100,
        background:
          "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.35) 65%, rgba(255, 255, 255, 0.35) 100%)",
        padding: "12px 60px",
        paddingBottom: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "end",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            position: "relative",
            width: BAR_WIDTH,
            height: BAR_TOP + 6 + 6 + LABEL_HEIGHT,
          }}
        >
          {MILESTONES.map((value) => (
            <Milestone
              key={value}
              value={value}
              iconUrl={value === MID_MILESTONE ? undefined : iconUrl}
            />
          ))}

          <div
            style={{
              position: "absolute",
              right: "70%",
              top: BAR_TOP - 26,
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <div
              style={{
                background: ACCENT,
                borderRadius: 12,
                borderBottomRightRadius: 0,
                padding: "1px 10px",
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "NotoSans",
                lineHeight: "18px",
                whiteSpace: "nowrap",
              }}
            >
              {`${charge} total!`}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: BAR_TOP,
              height: 10,
              borderRadius: 2,
              border: "1px solid white",
              background: TRACK,
              overflow: "hidden",
              transform: "skewX(-10deg)",
              padding: 1,
            }}
          >
            <div
              style={{
                width: `${fillPercent}%`,
                height: "100%",
                background: TRACK_ACCENT,
                borderRadius: 2,
              }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: -10,
            marginRight: -30,
            fontSize: 10,
            fontFamily: "NotoSans",
            color: FOOTER,
            textAlign: "right",
            whiteSpace: "nowrap",
          }}
        >
          ※ Resets when a pick-up student is obtained.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 55%, rgba(255, 255, 255, 1) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 55%, rgba(255, 255, 255, 1) 100%)",
          boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.6)",
        }}
      />
    </div>
  );
}
