import { SupportedConversions } from '../types';

/**
 * Supported conversion formats
 */
export const SUPPORTED_CONVERSIONS: SupportedConversions = {
  jpg: ['png', 'pdf'],
  jpeg: ['png', 'pdf'],
  png: ['jpg', 'pdf'],
  pdf: ['jpg', 'png'],
  // Note: Document conversions (PDF <-> Word) require server-side processing
  // and are not included in this client-side version
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
