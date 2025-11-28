import React from 'react';
import { ConversionStatus } from '../types';

interface ConversionProgressProps {
  status: ConversionStatus;
  progress: number;
  error: string | null;
}

export const ConversionProgress: React.FC<ConversionProgressProps> = ({
  status,
  progress,
  error,
}) => {
  if (status === 'idle') return null;

  return (
    <div className="conversion-progress">
      {status === 'converting' && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="progress-text">Converting... {progress}%</p>
        </div>
      )}

      {status === 'success' && (
        <div className="success-message">
          <span className="success-icon">✓</span>
          <span>Conversion successful!</span>
        </div>
      )}

      {status === 'error' && (
        <div className="error-message">
          <span className="error-icon">✗</span>
          <span>{error || 'Conversion failed'}</span>
        </div>
      )}
    </div>
  );
};
