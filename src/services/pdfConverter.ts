import jsPDF from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * PDF conversion utilities
 * Handles Image <-> PDF conversions using jsPDF and pdf.js
 */

/**
 * Convert image to PDF with proper resizing
 */
export const imageToPdf = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        try {
          // Get original image dimensions
          const imgWidth = img.width;
          const imgHeight = img.height;
          const ratio = imgWidth / imgHeight;

          // A4 dimensions in mm
          const a4Width = 210;
          const a4Height = 297;

          // Calculate optimal PDF dimensions and orientation
          let pdfWidth: number;
          let pdfHeight: number;
          let orientation: 'portrait' | 'landscape';

          if (ratio > 1) {
            // Landscape image
            orientation = 'landscape';
            pdfWidth = a4Height;
            pdfHeight = a4Width;
          } else {
            // Portrait image
            orientation = 'portrait';
            pdfWidth = a4Width;
            pdfHeight = a4Height;
          }

          // Create PDF with appropriate orientation
          const pdf = new jsPDF({
            orientation,
            unit: 'mm',
            format: 'a4',
          });

          // Calculate dimensions to fit image within PDF page with margins
          const margin = 10; // 10mm margin
          const maxWidth = pdfWidth - 2 * margin;
          const maxHeight = pdfHeight - 2 * margin;

          let finalWidth: number;
          let finalHeight: number;

          // Scale image to fit within the page while maintaining aspect ratio
          if (ratio > maxWidth / maxHeight) {
            // Width is the limiting factor
            finalWidth = maxWidth;
            finalHeight = maxWidth / ratio;
          } else {
            // Height is the limiting factor
            finalHeight = maxHeight;
            finalWidth = maxHeight * ratio;
          }

          // Center the image on the page
          const xOffset = (pdfWidth - finalWidth) / 2;
          const yOffset = (pdfHeight - finalHeight) / 2;

          // Resize image using canvas for better quality
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            throw new Error('Failed to get canvas context');
          }

          // Set canvas size to optimized dimensions (DPI optimization)
          const targetWidth = Math.min(imgWidth, 1920); // Max width for quality
          const targetHeight = (targetWidth / imgWidth) * imgHeight;

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          // Draw resized image
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Add resized image to PDF
          const resizedImageData = canvas.toDataURL('image/jpeg', 0.95);
          pdf.addImage(resizedImageData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight);

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
 * Convert PDF to images (JPG or PNG) with proper resizing
 * Extracts each page as a separate image with optimal dimensions
 */
export const pdfToImages = async (
  file: File,
  format: 'jpg' | 'png' = 'jpg',
  targetWidth: number = 1920
): Promise<Blob[]> => {
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

      // Get the page viewport at scale 1 to determine aspect ratio
      const viewport1 = page.getViewport({ scale: 1 });
      const pageWidth = viewport1.width;
      const pageHeight = viewport1.height;
      const aspectRatio = pageWidth / pageHeight;

      // Calculate scale to achieve target width while maintaining quality
      // Limit to reasonable dimensions (max 1920px width for standard quality)
      const desiredWidth = Math.min(targetWidth, pageWidth * 3); // Max 3x original
      const scale = desiredWidth / pageWidth;

      // Get viewport with calculated scale
      const viewport = page.getViewport({ scale });

      // Create high-quality canvas for rendering
      const renderCanvas = document.createElement('canvas');
      const renderContext = renderCanvas.getContext('2d');

      if (!renderContext) {
        throw new Error('Failed to get canvas context');
      }

      renderCanvas.width = viewport.width;
      renderCanvas.height = viewport.height;

      // Render PDF page to canvas
      await page.render({
        canvasContext: renderContext,
        viewport: viewport,
      }).promise;

      // Create output canvas with desired dimensions
      const outputCanvas = document.createElement('canvas');
      const outputContext = outputCanvas.getContext('2d');

      if (!outputContext) {
        throw new Error('Failed to get output canvas context');
      }

      // Calculate output dimensions (resize if needed)
      let outputWidth = renderCanvas.width;
      let outputHeight = renderCanvas.height;

      // If image is too large, resize it down
      if (outputWidth > targetWidth) {
        outputWidth = targetWidth;
        outputHeight = targetWidth / aspectRatio;
      }

      outputCanvas.width = outputWidth;
      outputCanvas.height = outputHeight;

      // Draw the rendered PDF page onto the output canvas (with resize if needed)
      outputContext.drawImage(renderCanvas, 0, 0, outputWidth, outputHeight);

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        outputCanvas.toBlob(
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
