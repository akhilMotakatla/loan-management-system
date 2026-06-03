import fs from 'fs';

// Local file storage service — replaces Cloudinary for personal portfolio use.

export const deleteLocalFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.warn('Could not delete file:', err.message);
  }
};

// Kept for backwards compatibility with any imports
export const uploadToCloudinary  = null;
export const deleteFromCloudinary = null;
