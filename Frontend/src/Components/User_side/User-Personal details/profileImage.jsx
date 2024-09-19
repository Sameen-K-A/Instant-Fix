import React, { useState, useRef } from 'react';
import userAxiosInstance from '../../../Config/userInstance';
import { toast } from "sonner";
import axios from 'axios';
import { useUserDetails } from '../../../Contexts/UserDetailsContext';
import { Camera } from '../../../../public/svgs/Icons';

const ProfileImage = () => {
   const [selectedImage, setSelectedImage] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const { userDetails, setUserDetails } = useUserDetails();
   const fileInputRef = useRef(null);

   async function uploadImageToS3(url, file) {
      try {
         const response = await axios.put(url, file, {
            headers: { 'Content-Type': file.type }
         });
         if (response.status !== 200) {
            throw new Error("Failed to upload image to S3 bucket");
         };
      } catch (error) {
         throw new Error("Failed to upload image to S3 bucket");
      };
   };

   async function updateDataBase(imageName) {
      try {
         const response = await userAxiosInstance.patch("/updateProfileImage", { user_id: userDetails.user_id, imageName: imageName });
         const afterUpdate = { ...userDetails, profileIMG: response.data };
         setUserDetails(afterUpdate);
         localStorage.setItem("userDetails", JSON.stringify(afterUpdate));
         toast.success("Successfully updated profile image");
      } catch (error) {
         handleError(error);
      };
   };

   async function handleUploadImage() {
      if (selectedImage) {
         setIsLoading(true);
         try {
            const response = await userAxiosInstance.get("/getPreSignedURL", {
               params: { imageName: selectedImage.name, imageType: selectedImage.type }
            });
            if (response.data?.URL) {
               await uploadImageToS3(response.data.URL, selectedImage);
               await updateDataBase(response.data.uniqueImageName);
               setSelectedImage(null)
            } else {
               toast.error("Failed to upload image.");
            }
         } catch (error) {
            handleError(error);
         } finally {
            setIsLoading(false);
         };
      } else {
         toast.error("Select one image");
      }
   }

   function handleError(error) {
      if (error.response?.status === 301) {
         toast.warning("Failed to update profile image");
      } else if (error.response?.status === 401) {
         setIsLogged(false);
         navigate("/login", { state: { message: "Authorization failed, please login." } });
      } else {
         toast.error("Something went wrong, please try again later.");
      }
   }

   function handleCameraClick() {
      if (fileInputRef.current) {
         fileInputRef.current.click();
      }
   }

   return (
      <>
         <input type="file" className='cursor-pointer' ref={fileInputRef} hidden onChange={(e) => setSelectedImage(e.target?.files && e.target.files[0])} accept='.jpg, .jpeg, .png' />
         <div className="col-auto position-relative">
            <div className="avatar avatar-xl position-relative">
               <img src={selectedImage instanceof File ? URL.createObjectURL(selectedImage) : `${userDetails?.profileIMG}`} alt="profile_image" className="w-100 h-100 border-radius-lg shadow-sm" />
               <div
                  className='position-absolute bg-white d-flex justify-content-center align-items-center border-radius-lg'
                  style={{ bottom: '-5px', right: '-5px', width: '30px', height: '30px', cursor: 'pointer' }}
                  onClick={handleCameraClick}>
                  <Camera />
               </div>
            </div>
         </div>
         {!isLoading ? (
            selectedImage &&
            <div className='d-flex gap-2 mt-3'>
               <button className='btn btn-outline-primary' onClick={() => setSelectedImage(null)}>Cancel</button>
               <button className='btn bg-gradient-primary' onClick={handleUploadImage} disabled={isLoading}>Upload your profile image</button>
            </div>
         ) : (
            <p className='text-sm text-bold mt-3'>Loading . . .</p>
         )}
      </>
   );
}

export default ProfileImage;