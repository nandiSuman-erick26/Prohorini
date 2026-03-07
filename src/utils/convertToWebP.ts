/**
 * Converts an image File to WebP format using the Canvas API.
 * Also resizes the image if it exceeds the specified max dimension.
 *
 * @param file - The original image File
 * @param maxWidth - Maximum width in pixels (default: 1920)
 * @param quality - WebP quality from 0 to 1 (default: 0.8)
 * @returns A new File in WebP format
 */
export const convertToWebP = (
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      // Draw onto canvas
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convert to WebP blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to convert image to WebP"));
            return;
          }

          // Create a new File from the blob with .webp extension
          const baseName = file.name.replace(/\.[^/.]+$/, "");
          const webpFile = new File([blob], `${baseName}.webp`, {
            type: "image/webp",
          });

          // console.log(
          //   `[convertToWebP] ${file.name}: ${(file.size / 1024).toFixed(0)}KB → ${(webpFile.size / 1024).toFixed(0)}KB (${Math.round((1 - webpFile.size / file.size) * 100)}% smaller)`,
          // );

          resolve(webpFile);
        },
        "image/webp",
        quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for conversion"));
    };

    img.src = url;
  });
};
