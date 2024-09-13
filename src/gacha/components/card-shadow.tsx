import React from 'react';

export interface CardShadowProps {
  rarity: number;
}

function getShadowBackgroundForRarity(rarity: number) {
  switch (rarity) {
    case 1:
      return 'transparent';
    case 2:
      return (
        'linear-gradient(' +
        'to top,' +
        'rgba(255, 255, 255, 0) 12.5%,' +
        'rgba(250, 250, 250, 0.3) 25%,' +
        'rgba(245, 245, 245, 0.7) 45%,' +
        'rgba(255, 255, 255, 0.9) 50%,' +
        'rgba(245, 245, 245, 0.7) 55%,' +
        'rgba(250, 250, 250, 0.3) 75%,' +
        'rgba(255, 255, 255, 0) 87.5%' +
        ')'
      );
    case 3:
      return (
        'linear-gradient(' +
        'to top,' +
        'rgba(211, 225, 250, 0.2),' +
        'rgba(245, 228, 252, 0.65) 20%,' +
        'rgba(250, 250, 250, 0.9) 40%,' +
        'rgba(255, 255, 255, 1) 50%,' +
        'rgba(250, 250, 250, 0.9) 60%,' +
        'rgba(245, 228, 252, 0.65) 80%,' +
        'rgba(211, 225, 250, 0.2)' +
        ')'
      );
    default:
      return 'transparent';
  }
}

export const CardShadow = ({ rarity }: CardShadowProps) => {
  return (
    <div
      // shadow-wrapper
      style={{
        width: 115,
        height: 140,
        transform: 'skewX(-10deg)',
        margin: '25px 15px',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        // shadow
        style={{
          position: 'absolute',
          width: 137,
          height: 400,
          background: getShadowBackgroundForRarity(rarity),
        }}
      />
    </div>
  );
};
