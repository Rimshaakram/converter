import { FileFormat, FileInfo } from '../types';
import { SUPPORTED_CONVERSIONS, MAX_FILE_SIZE } from './constants';

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

/**
 * Validate file size
 */
export const validateFileSize = (file: File): { valid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }
  return { valid: true };
};

/**
 * Validate conversion
 */
export const validateConversion = (
  inputFormat: FileFormat,
  outputFormat: FileFormat
): { valid: boolean; error?: string } => {
  if (!SUPPORTED_CONVERSIONS[inputFormat]) {
    return {
      valid: false,
      error: `Input format '${inputFormat}' is not supported`,
    };
  }

  if (!SUPPORTED_CONVERSIONS[inputFormat].includes(outputFormat)) {
    return {
      valid: false,
      error: `Conversion from '${inputFormat}' to '${outputFormat}' is not supported`,
    };
  }

  return { valid: true };
};

/**
 * Get file info from File object
 */
export const getFileInfo = (file: File): FileInfo => {
  const extension = getFileExtension(file.name) as FileFormat;
  return {
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    extension,
  };
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Download file from blob
 */
export const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Change file extension
 */
export const changeFileExtension = (filename: string, newExtension: string): string => {
  const parts = filename.split('.');
  if (parts.length > 1) {
    parts[parts.length - 1] = newExtension;
    return parts.join('.');
  }
  return `${filename}.${newExtension}`;
};
