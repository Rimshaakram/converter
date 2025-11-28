import React from 'react';
import { FileFormat } from '../types';
import { SUPPORTED_CONVERSIONS, FORMAT_NAMES } from '../utils/constants';

interface FormatSelectorProps {
  inputFormat: FileFormat;
  selectedFormat: FileFormat | null;
  onFormatSelect: (format: FileFormat) => void;
  disabled?: boolean;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  inputFormat,
  selectedFormat,
  onFormatSelect,
  disabled,
}) => {
  const availableFormats = SUPPORTED_CONVERSIONS[inputFormat] || [];

  return (
    <div className="format-selector">
      <h3 className="selector-title">Convert to:</h3>
      <div className="format-options">
        {availableFormats.map((format) => (
          <button
            key={format}
            className={`format-btn ${selectedFormat === format ? 'selected' : ''}`}
            onClick={() => onFormatSelect(format)}
            disabled={disabled}
          >
            <span className="format-icon">
              {format === 'pdf' ? '📄' : format === 'jpg' || format === 'jpeg' ? '🖼️' : '🎨'}
            </span>
            <span className="format-label">{FORMAT_NAMES[format] || format.toUpperCase()}</span>
          </button>
        ))}
      </div>
      {availableFormats.length === 0 && (
        <p className="no-formats">No conversion options available for this format.</p>
      )}
    </div>
  );
};
