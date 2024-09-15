import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

AWS.config.update({
   accessKeyId: process.env.S3_Access_key as string,
   secretAccessKey: process.env.S3_Secret_key as string,
   region: process.env.S3_Region as string
});

const S3: AWS.S3 = new AWS.S3();

function generatePreSignedURL(bucketName: string, imageName: string): string {
   const params = {
      Bucket: bucketName,
      Key: imageName,
      Expires: 120,
      ContentType: 'image/jpeg',
   };

   try {
      const url: string = S3.getSignedUrl("putObject", params);
      return url;
   } catch (error) {
      throw error;
   };

};

export default generatePreSignedURL;