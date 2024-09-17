import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

AWS.config.update({
   accessKeyId: process.env.S3_Access_key as string,
   secretAccessKey: process.env.S3_Secret_key as string,
   region: process.env.S3_Region as string
});

const S3: AWS.S3 = new AWS.S3();

function generatePutPreSignedURL(imageName: string, imageType: string): string {
   const params = {
      Bucket: process.env.S3_bucketName as string,
      Key: imageName,
      Expires: 120,
      ContentType: imageType,
   };

   try {
      const url: string = S3.getSignedUrl("putObject", params);
      return url;
   } catch (error) {
      throw error;
   };
};

function generateGetPreSignedURL(imageName: string): string {
   const params = {
      Bucket: process.env.S3_bucketName as string,
      Key: imageName,
      Expires: 3600 * 24 * 7
   };

   try {
      const url = S3.getSignedUrl("getObject", params);
      return url;
   } catch (error) {
      throw error;
   }
}


export { generatePutPreSignedURL, generateGetPreSignedURL };