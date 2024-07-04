import { v2 as cloudinary } from "cloudinary";

export const uploadImage = (image) => {
  const config = useRuntimeConfig();
  return new Promise((resolve, reject) => {
    cloudinary.config({
      cloud_name: config.cloudinaryCloudName,
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret,
      secure: true,
    });

    cloudinary.uploader.upload(image, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};
