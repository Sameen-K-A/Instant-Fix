import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

const s3Client = new S3Client({
   region: process.env.S3_Region as string,
   credentials: {
      accessKeyId: process.env.S3_Access_key as string,
      secretAccessKey: process.env.S3_Secret_key as string,
   },
});

async function generatePutPreSignedURL(imageName: string, imageType: string): Promise<string> {
   const command = new PutObjectCommand({
      Bucket: process.env.S3_bucketName as string,
      Key: imageName,
      ContentType: imageType,
   });

   try {
      const url = await getSignedUrl(s3Client, command, { expiresIn: 120 });
      return url;
   } catch (error) {
      throw error;
   };
};

async function generateGetPreSignedURL(imageName: string): Promise<string> {
   const command = new GetObjectCommand({
      Bucket: process.env.S3_bucketName as string,
      Key: imageName,
   });

   try {
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 * 24 * 7 });
      return url;
   } catch (error) {
      throw error;
   };
};

export { generatePutPreSignedURL, generateGetPreSignedURL };