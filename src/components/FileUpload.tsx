import React, { useRef, useState } from 'react';
import { FileInfo } from '../types';
import { getFileInfo, validateFileSize, formatFileSize } from '../utils/fileHelpers';
import { ACCEPTED_FILE_TYPES } from '../utils/constants';

interface FileUploadProps {
  onFileSelect: (fileInfo: FileInfo) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);

    // Validate file size
    const sizeValidation = validateFileSize(file);
    if (!sizeValidation.valid) {
      setError(sizeValidation.error || 'Invalid file size');
      return;
    }

    // Get file info and pass to parent
    const fileInfo = getFileInfo(file);
    onFileSelect(fileInfo);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="file-upload">
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="file-input"
          accept={Object.keys(ACCEPTED_FILE_TYPES).join(',')}
          onChange={handleChange}
          disabled={disabled}
        />
        <div className="upload-icon">📁</div>
        <p className="upload-text">
          <strong>Click to upload</strong> or drag and drop
        </p>
        <p className="upload-hint">
          Supported: JPG, PNG, PDF (max {formatFileSize(10 * 1024 * 1024)})
        </p>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};
