import React from "react";
import type { BannerChargeCategory, Student } from "../../db/client";
import {
  GACHA_CHARA_CARD_BG_BUFFER,
  GACHA_MILESTONE_100_ICON_BUFFER,
} from "../preloaded-buffers";

const MAX_CHARGE = 200;
const MID_MILESTONE = 100;
const BAR_WIDTH = 190;
const ICON_SIZE = 56;

const ACCENT_BASE = "#0ebaf2";
const ACCENT_LIMITED = "#fc54da";
const TRACK = "#d4d4d4";
const TRACK_ACCENT_BASE = "#63e3ff";
const TRACK_ACCENT_LIMITED = "#ff8ae5";
const LABEL_BORDER = "#a8a9ab";
const LABEL_BORDER_ACTIVE_BASE = "#36cdff";
const LABEL_BORDER_ACTIVE_LIMITED = "#ff8ae5";
const LABEL_TEXT = "#858585";
const LABEL_TEXT_ACTIVE_BASE = "#2b8bb5";
const LABEL_TEXT_ACTIVE_LIMITED = "#c14098";
const FOOTER = "#4d7289";
const BAR_TOP = 68;
const LABEL_HEIGHT = 18;

const MILESTONES = [MID_MILESTONE, MAX_CHARGE] as const;

type BannerChargeTheme = {
  accent: string;
  track: string;
  trackAccent: string;
  labelBorder: string;
  labelBorderActive: string;
  labelText: string;
  labelTextActive: string;
  footer: string;
};

const BANNER_CHARGE_BASE_THEME: BannerChargeTheme = {
  accent: ACCENT_BASE,
  track: TRACK,
  trackAccent: TRACK_ACCENT_BASE,
  labelBorder: LABEL_BORDER,
  labelBorderActive: LABEL_BORDER_ACTIVE_BASE,
  labelText: LABEL_TEXT,
  labelTextActive: LABEL_TEXT_ACTIVE_BASE,
  footer: FOOTER,
};

const BANNER_CHARGE_LIMITED_THEME: BannerChargeTheme = {
  accent: ACCENT_LIMITED,
  track: TRACK,
  trackAccent: TRACK_ACCENT_LIMITED,
  labelBorder: LABEL_BORDER,
  labelBorderActive: LABEL_BORDER_ACTIVE_LIMITED,
  labelText: LABEL_TEXT,
  labelTextActive: LABEL_TEXT_ACTIVE_LIMITED,
  footer: FOOTER,
};

function getTheme(
  bannerChargeCategory: BannerChargeCategory,
): BannerChargeTheme {
  switch (bannerChargeCategory) {
    case "Standard":
      return BANNER_CHARGE_BASE_THEME;
    case "Unique":
    case "Anniversary":
      return BANNER_CHARGE_LIMITED_THEME;
  }
}

export interface ChargeContainerProps {
  charge: number;
  pickupStudent?: Student;
  bannerChargeCategory?: BannerChargeCategory;
}

function Milestone({
  value,
  iconUrl,
  theme,
  isActive = false,
}: {
  value: number;
  iconUrl?: string;
  theme: BannerChargeTheme;
  isActive?: boolean;
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
          border: `1px solid ${isActive ? theme.labelBorderActive : theme.labelBorder}`,
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
              width: ICON_SIZE + 4,
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
            color: isActive ? theme.labelTextActive : theme.labelText,
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
            background: isActive ? theme.labelBorderActive : theme.labelBorder,
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
          border: `1px solid ${isActive ? theme.labelBorderActive : theme.labelBorder}`,
          background: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 700,
          fontFamily: "NotoSans",
          color: isActive ? theme.labelTextActive : theme.labelText,
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
  bannerChargeCategory = "Standard",
}: ChargeContainerProps) {
  const theme = getTheme(bannerChargeCategory);
  const fillRatio = Math.min(Math.max(charge, 0) / MAX_CHARGE, 1);
  const fillPercent = fillRatio * 100;
  const iconUrl = pickupStudent
    ? `https://aronabot.cdn.nimblebun.works/v2/images/students/icons/${pickupStudent.id}.png`
    : undefined;

  const accent = theme.accent;
  const trackAccent = theme.trackAccent;

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
              theme={theme}
              isActive={charge >= value}
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
                background: accent,
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
                background: trackAccent,
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
            color: theme.footer,
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
