import React from 'react';
import { Student } from '../../models/Student';
import {
  GACHA_CHARA_CARD_BG_BUFFER,
  GACHA_PICKUP_BUFFER,
  GACHA_STAR_BUFFER,
} from '../preloaded-buffers';

export interface CardProps {
  student: Student;
  isPickup: boolean;
  icon: string;
}

function getCardBeforeBoxShadowForRarity(rarity: number) {
  switch (rarity) {
    case 1:
      return '0 4px 4px 1px rgb(187, 199, 209)';
    case 2:
      return `0 4px 4px 1px #f3e7ad, 0 0px 5px 4px #faf7c5`;
    case 3:
      return `0 4px 4px 1px #c5a7ee, 0 0px 5px 4px #fadbed`;
    default:
      return '0 4px 4px 1px rgb(187, 199, 209)';
  }
}

function getIconBackgroundForRarity(rarity: number) {
  switch (rarity) {
    case 1:
      return 'transparent';
    case 2:
      return 'rgba(252, 245, 120, 0.9)';
    case 3:
      return 'rgba(249, 195, 219, 0.85)';
    default:
      return 'transparent';
  }
}

export const Card = ({ student, isPickup, icon }: CardProps) => {
  return (
    <div
      // card
      style={{
        width: 115,
        height: 140,
        transform: 'skewX(-10deg)',
        margin: '25px 15px',
        position: 'relative',
        display: 'flex',
      }}
    >
      <div
        // card::before
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '4px',
          boxShadow: getCardBeforeBoxShadowForRarity(student.rarity),
        }}
      />

      <div
        // icon-container
        style={{
          position: 'relative',
          width: '100%',
          height: 110,
          border: '2px solid white',
          borderRadius: '4px',
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        <div
          // icon-container::before
          style={{
            position: 'absolute',
            top: -4,
            left: -12,
            width: 134,
            transform: 'skewX(10deg)',
            height: 110,
            backgroundImage: `url(${GACHA_CHARA_CARD_BG_BUFFER})`,
            backgroundSize: '134px 110px',
          }}
        />

        <img
          // icon
          src={`data:image/png;base64,${icon}`}
          style={{
            position: 'relative',
            flexShrink: 0,
            top: 0,
            left: -13,
            width: 138,
            maxWidth: 138,
            transform: 'skewX(10deg)',
            background: getIconBackgroundForRarity(student.rarity),
          }}
        />

        <div
          // TODO: fix border not being taken into account when calculating
          // transformed clip paths in satori
          style={{
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            border: '2px solid white',
          }}
        />
      </div>

      <div
        // card::after
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: 115,
          height: 32,
          background: 'rgb(98, 112, 130)',
          border: '2px solid white',
          borderRadius: '4px',
          boxSizing: 'content-box',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {Array.from({ length: student.rarity }, (_, i) => (
          <img
            // star
            key={i}
            src={GACHA_STAR_BUFFER}
            style={{
              width: 20,
              transform: 'skewX(10deg)',
            }}
          />
        ))}
      </div>

      {isPickup && (
        <img
          // badge/pickup
          src={GACHA_PICKUP_BUFFER}
          style={{
            position: 'absolute',
            left: -10,
            top: -10,
            height: 20,
            transform: 'skewX(10deg)',
          }}
        />
      )}
    </div>
  );
};
