import jsPDF from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * PDF conversion utilities
 * Handles Image <-> PDF conversions using jsPDF and pdf.js
 */

/**
 * Convert image to PDF
 */
export const imageToPdf = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        try {
          // Calculate PDF dimensions
          const imgWidth = img.width;
          const imgHeight = img.height;
          const ratio = imgWidth / imgHeight;

          // A4 dimensions in mm
          const pdfWidth = 210;
          const pdfHeight = pdfWidth / ratio;

          // Create PDF
          const pdf = new jsPDF({
            orientation: ratio > 1 ? 'landscape' : 'portrait',
            unit: 'mm',
            format: 'a4',
          });

          // Add image to PDF
          pdf.addImage(img.src, 'JPEG', 0, 0, pdfWidth, pdfHeight);

          // Convert to blob
          const pdfBlob = pdf.output('blob');
          resolve(pdfBlob);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Convert PDF to images (JPG or PNG)
 * Extracts each page as a separate image
 */
export const pdfToImages = async (file: File, format: 'jpg' | 'png' = 'jpg'): Promise<Blob[]> => {
  try {
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    const images: Blob[] = [];

    // Convert each page to image
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      // Set scale for better quality (2x resolution)
      const scale = 2.0;
      const viewport = page.getViewport({ scale });

      // Create canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Failed to get canvas context');
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Render PDF page to canvas
      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert canvas to blob'));
            }
          },
          format === 'png' ? 'image/png' : 'image/jpeg',
          0.95
        );
      });

      images.push(blob);
    }

    return images;
  } catch (error) {
    console.error('PDF to images conversion error:', error);
    throw new Error(
      `Failed to convert PDF to images: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Convert PDF to JPG (returns first page)
 */
export const pdfToJpg = async (file: File): Promise<Blob> => {
  const images = await pdfToImages(file, 'jpg');

  if (images.length === 0) {
    throw new Error('No pages found in PDF');
  }

  // Return the first page
  return images[0];
};

/**
 * Convert PDF to PNG (returns first page)
 */
export const pdfToPng = async (file: File): Promise<Blob> => {
  const images = await pdfToImages(file, 'png');

  if (images.length === 0) {
    throw new Error('No pages found in PDF');
  }

  // Return the first page
  return images[0];
};

/**
 * Convert JPG to PDF
 */
export const jpgToPdf = async (file: File): Promise<Blob> => {
  return imageToPdf(file);
};

/**
 * Convert PNG to PDF
 */
export const pngToPdf = async (file: File): Promise<Blob> => {
  return imageToPdf(file);
};
