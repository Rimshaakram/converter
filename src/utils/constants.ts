import { SupportedConversions } from '../types';

/**
 * Supported conversion formats
 */
export const SUPPORTED_CONVERSIONS: SupportedConversions = {
  jpg: ['png', 'pdf'],
  jpeg: ['png', 'pdf'],
  png: ['jpg', 'pdf'],
  pdf: ['jpg', 'png'],
  docx: ['pdf'],
  doc: ['pdf'],
};

/**
 * Maximum file size (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Accepted file types for upload
 */
export const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
};

/**
 * Format display names
 */
export const FORMAT_NAMES: Record<string, string> = {
  jpg: 'JPG',
  jpeg: 'JPEG',
  png: 'PNG',
  pdf: 'PDF',
  docx: 'Word (DOCX)',
  doc: 'Word (DOC)',
};
