import jsPDF from 'jspdf';

/**
 * PDF conversion utilities
 * Handles Image <-> PDF conversions using jsPDF
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
 * Convert PDF to images
 * Note: This is a placeholder. Full PDF to image conversion requires a library like pdf.js
 * For a production app, you would need to implement this with proper PDF rendering
 */
export const pdfToImages = async (file: File): Promise<Blob[]> => {
  // This would require pdf.js or similar library for proper implementation
  // For now, return an error
  throw new Error(
    'PDF to image conversion requires server-side processing. This feature will be available in a future update.'
  );
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
