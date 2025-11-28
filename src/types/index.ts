/**
 * Supported file formats for conversion
 */
export type FileFormat = 'jpg' | 'jpeg' | 'png' | 'pdf' | 'docx' | 'doc';

/**
 * Conversion status
 */
export type ConversionStatus = 'idle' | 'converting' | 'success' | 'error';

/**
 * Supported conversion mappings
 */
export interface SupportedConversions {
  [key: string]: FileFormat[];
}

/**
 * Conversion result
 */
export interface ConversionResult {
  success: boolean;
  outputUrl?: string;
  fileName?: string;
  error?: string;
}

/**
 * File info
 */
export interface FileInfo {
  file: File;
  name: string;
  size: number;
  type: string;
  extension: FileFormat;
}

/**
 * Conversion request
 */
export interface ConversionRequest {
  inputFile: File;
  inputFormat: FileFormat;
  outputFormat: FileFormat;
}

/**
 * Conversion state
 */
export interface ConversionState {
  status: ConversionStatus;
  progress: number;
  result: ConversionResult | null;
  error: string | null;
}
