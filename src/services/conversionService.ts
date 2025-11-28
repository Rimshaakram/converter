import { FileFormat, ConversionResult } from '../types';
import { jpgToPng, pngToJpg } from './imageConverter';
import { jpgToPdf, pngToPdf, pdfToJpg, pdfToPng } from './pdfConverter';
import { wordToPdf } from './wordConverter';
import { changeFileExtension } from '../utils/fileHelpers';

/**
 * Main conversion service
 * Routes conversion requests to appropriate converter
 */
export const convertFile = async (
  file: File,
  inputFormat: FileFormat,
  outputFormat: FileFormat
): Promise<ConversionResult> => {
  try {
    let resultBlob: Blob | Blob[];
    let fileName: string;

    // Image conversions
    if ((inputFormat === 'jpg' || inputFormat === 'jpeg') && outputFormat === 'png') {
      resultBlob = await jpgToPng(file);
      fileName = changeFileExtension(file.name, 'png');
    } else if (inputFormat === 'png' && (outputFormat === 'jpg' || outputFormat === 'jpeg')) {
      resultBlob = await pngToJpg(file);
      fileName = changeFileExtension(file.name, 'jpg');
    }
    // Image to PDF conversions
    else if ((inputFormat === 'jpg' || inputFormat === 'jpeg') && outputFormat === 'pdf') {
      resultBlob = await jpgToPdf(file);
      fileName = changeFileExtension(file.name, 'pdf');
    } else if (inputFormat === 'png' && outputFormat === 'pdf') {
      resultBlob = await pngToPdf(file);
      fileName = changeFileExtension(file.name, 'pdf');
    }
    // PDF to image conversions
    else if (inputFormat === 'pdf' && outputFormat === 'jpg') {
      resultBlob = await pdfToJpg(file);
      fileName = changeFileExtension(file.name, 'jpg');
    } else if (inputFormat === 'pdf' && outputFormat === 'png') {
      resultBlob = await pdfToPng(file);
      fileName = changeFileExtension(file.name, 'png');
    }
    // Word to PDF conversion
    else if (inputFormat === 'docx' && outputFormat === 'pdf') {
      resultBlob = await wordToPdf(file);
      fileName = changeFileExtension(file.name, 'pdf');
    } else {
      throw new Error(`Conversion from ${inputFormat} to ${outputFormat} is not implemented`);
    }

    // Create download URL
    const outputUrl = URL.createObjectURL(resultBlob as Blob);

    return {
      success: true,
      outputUrl,
      fileName,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Conversion failed',
    };
  }
};
