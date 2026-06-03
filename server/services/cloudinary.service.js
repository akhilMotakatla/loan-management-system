import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

export const uploadToCloudinary = (buffer, folder, mimetype) =>
  new Promise((resolve, reject) => {
    const resourceType = mimetype.startsWith('image') ? 'image' : 'raw';
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    Readable.from(buffer).pipe(uploadStream);
  });

export const deleteFromCloudinary = (publicId) =>
  cloudinary.uploader.destroy(publicId);
