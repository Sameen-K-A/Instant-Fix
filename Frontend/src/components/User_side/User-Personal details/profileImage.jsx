import React, { useState } from 'react';
import userAxiosInstance from '../../../Config/AxiosInstance/userInstance';
import { toast } from "sonner";
import axios from 'axios';

const ProfileImage = () => {

   const [selectedImage, setSelectedImage] = useState(null);

   async function uploadImageToS3(url, file) {
      try {
         const response = await axios.put(`${url}`, file, {
            headers: {
               'Content-Type': file.type
            }
         });

         if (response.status === 200) {
            toast.success("Uploaded image to S3 bucket successfully");
         } else {
            toast.error("Failed to upload your profile image to cloud");
         }
      } catch (error) {
         console.log(error)
         toast.error("Something went wrong, please try again later.");
      }
   };

   async function handleUploadImage() {
      if (selectedImage) {
         try {
            const response = await userAxiosInstance.get("/getPreSignedURL", { params: { imageName: selectedImage.name } })
            if (response.data?.url) {
               uploadImageToS3(response.data.url, selectedImage)
            }
         } catch (error) {
            toast.error("Failed to generate preSignedURL from backend")
         }
      } else {
         toast.error("Select one image")
      }
   };

   return (
      <>
         <input type="file" alt='Upload image' onChange={(e) => setSelectedImage(e.target?.files && e.target.files[0])} />
         <button onClick={handleUploadImage}>Upload your profile image</button>
      </>
   )
}


export default ProfileImage