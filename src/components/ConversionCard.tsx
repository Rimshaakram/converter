import React from 'react';
import { ConversionType } from '../types/conversions';

interface ConversionCardProps {
  conversion: ConversionType;
  onSelect: (conversion: ConversionType) => void;
}

export const ConversionCard: React.FC<ConversionCardProps> = ({ conversion, onSelect }) => {
  const handleClick = () => {
    if (conversion.available) {
      onSelect(conversion);
    }
  };

  return (
    <div
      className={`conversion-card ${!conversion.available ? 'disabled' : ''}`}
      onClick={handleClick}
      style={
        {
          '--card-color': conversion.color,
        } as React.CSSProperties
      }
    >
      <div className="conversion-card-icon">{conversion.icon}</div>
      <h3 className="conversion-card-title">{conversion.title}</h3>
      <p className="conversion-card-description">{conversion.description}</p>
      {!conversion.available && (
        <span className="coming-soon-badge">Coming Soon</span>
      )}
      {conversion.available && (
        <div className="conversion-card-arrow">→</div>
      )}
    </div>
  );
};
