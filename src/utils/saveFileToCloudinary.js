import fs from 'fs/promises';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const saveFileToCloudinary = async (file) => {
  try {
    const result = await cloudinary.v2.uploader.upload(file.path);

    try {
      await fs.access(file.path);
      await fs.unlink(file.path);
    } catch (err) {
      console.error(`Error deleting file from tmp: ${err.message}`);
    }

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error.message);
    throw error;
  }
};

export default saveFileToCloudinary;