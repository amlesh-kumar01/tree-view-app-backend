import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import multer from "multer";
import streamifier from "streamifier";

config();

const upload = multer(); 

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = (req, res, next) => {
  if (!req.file) {
    return next(); // Proceed to the next middleware/route handler if no file is uploaded
  }

  const folderName = req.body.godown_id; 

  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folderName }, 
      (error, result) => {
        if (error) {
          return res.status(500).json({
            message: "Upload to Cloudinary failed.",
            error: error.message,
            success: false
          });
        }

        req.body.image_url = [result.secure_url]; // Correctly set the image URL
        next();
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred during the upload process.",
      error: error.message,
      success: false
    });
  }

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};

export { upload, uploadImage };
