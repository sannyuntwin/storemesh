import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  secure: true,
});

export const getCloudinaryImageUrl = (publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: 'fill' | 'scale' | 'fit' | 'thumb';
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
}) => {
  const transformations: string[] = [];
  
  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  if (options?.crop) transformations.push(`c_${options.crop}`);
  if (options?.quality) transformations.push(`q_${options.quality}`);
  if (options?.format) transformations.push(`f_${options.format}`);
  
  const transformationString = transformations.length > 0 ? transformations.join(',') : '';
  const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
  
  return transformationString 
    ? `${baseUrl}/${transformationString}/${publicId}`
    : `${baseUrl}/${publicId}`;
};

export const getCloudinaryPublicId = (url: string) => {
  const regex = /\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export default cloudinary;
