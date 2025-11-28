import { FileFormat } from './index';

/**
 * Conversion type definition
 */
export interface ConversionType {
  id: string;
  title: string;
  description: string;
  icon: string;
  inputFormat: FileFormat;
  outputFormat: FileFormat;
  color: string;
  available: boolean;
}

/**
 * Available conversion types
 */
export const CONVERSION_TYPES: ConversionType[] = [
  {
    id: 'jpg-to-png',
    title: 'JPG to PNG',
    description: 'Convert JPEG images to PNG format with transparency support',
    icon: '🖼️',
    inputFormat: 'jpg',
    outputFormat: 'png',
    color: '#3b82f6',
    available: true,
  },
  {
    id: 'png-to-jpg',
    title: 'PNG to JPG',
    description: 'Convert PNG images to JPEG format with smaller file size',
    icon: '🎨',
    inputFormat: 'png',
    outputFormat: 'jpg',
    color: '#10b981',
    available: true,
  },
  {
    id: 'jpg-to-pdf',
    title: 'JPG to PDF',
    description: 'Convert JPEG images to PDF document format',
    icon: '📄',
    inputFormat: 'jpg',
    outputFormat: 'pdf',
    color: '#8b5cf6',
    available: true,
  },
  {
    id: 'png-to-pdf',
    title: 'PNG to PDF',
    description: 'Convert PNG images to PDF document format',
    icon: '📋',
    inputFormat: 'png',
    outputFormat: 'pdf',
    color: '#f59e0b',
    available: true,
  },
  {
    id: 'pdf-to-jpg',
    title: 'PDF to JPG',
    description: 'Extract pages from PDF as JPEG images',
    icon: '🔄',
    inputFormat: 'pdf',
    outputFormat: 'jpg',
    color: '#ef4444',
    available: false,
  },
  {
    id: 'word-to-pdf',
    title: 'Word to PDF',
    description: 'Convert Word documents (DOCX) to PDF format',
    icon: '📝',
    inputFormat: 'docx',
    outputFormat: 'pdf',
    color: '#06b6d4',
    available: false,
  },
];
