import React from 'react';
import { FileInfo as FileInfoType } from '../types';
import { formatFileSize } from '../utils/fileHelpers';
import { FORMAT_NAMES } from '../utils/constants';

interface FileInfoProps {
  fileInfo: FileInfoType;
  onRemove: () => void;
}

export const FileInfo: React.FC<FileInfoProps> = ({ fileInfo, onRemove }) => {
  return (
    <div className="file-info-card">
      <div className="file-info-content">
        <div className="file-icon">📄</div>
        <div className="file-details">
          <h3 className="file-name">{fileInfo.name}</h3>
          <p className="file-meta">
            {FORMAT_NAMES[fileInfo.extension] || fileInfo.extension.toUpperCase()} •{' '}
            {formatFileSize(fileInfo.size)}
          </p>
        </div>
        <button className="remove-btn" onClick={onRemove} title="Remove file">
          ✕
        </button>
      </div>
    </div>
  );
};
