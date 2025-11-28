/**
 * Image conversion utilities
 * Handles JPG <-> PNG conversions using Canvas API
 */

/**
 * Convert image to different format
 */
export const convertImage = async (
  file: File,
  outputFormat: 'jpg' | 'jpeg' | 'png'
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // For JPG conversion, fill white background (JPG doesn't support transparency)
          if (outputFormat === 'jpg' || outputFormat === 'jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx.drawImage(img, 0, 0);

          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to convert image'));
              }
            },
            outputFormat === 'png' ? 'image/png' : 'image/jpeg',
            0.95 // Quality for JPEG
          );
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
 * Convert JPG/JPEG to PNG
 */
export const jpgToPng = async (file: File): Promise<Blob> => {
  return convertImage(file, 'png');
};

/**
 * Convert PNG to JPG
 */
export const pngToJpg = async (file: File): Promise<Blob> => {
  return convertImage(file, 'jpg');
};
