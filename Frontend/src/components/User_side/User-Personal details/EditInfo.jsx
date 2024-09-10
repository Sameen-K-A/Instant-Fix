import { useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Base_URL } from "../../../config/credentials"; 
import profileDefault_1 from "../../../../public/images/profile_1.jpg";
import profileDefault_2 from "../../../../public/images/profile_2.jpg";
import profileDefault_3 from "../../../../public/images/profile_3.jpg";
import profileDefault_4 from "../../../../public/images/profile_4.jpg";
import userAxiosInstance from "../../../Config/AxiosInstance/userInstance"; 
import { toast } from "sonner";
import { useUserDetails } from "../../../Contexts/UserDetailsContext";
import { useUserAuthContext } from "../../../Contexts/UserAuthContext";

const EditUserInfo = ({ cancelEdit }) => {
  const [selectedDefaultimgIndex, setSelectedDefaultimgIndex] = useState(null);
  const [userSelectedImg, setUserSelectedImg] = useState(null);
  const fileInputRef = useRef(null);
  const { userDetails, setUserDetails } = useUserDetails();
  const { setIsLogged } = useUserAuthContext();

  const defaultImages = [profileDefault_1, profileDefault_2, profileDefault_3, profileDefault_4];

  const formik = useFormik({
    initialValues: {
      name: userDetails.name || '',
      phone: userDetails.phone || '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(3, 'Name must be between 3 and 20 characters.')
        .max(20, 'Name must be between 3 and 20 characters.')
        .matches(/^[A-Za-z\s]+$/, 'Name only supports alphabets.')
        .required('Name is required'),
      phone: Yup.string()
        .matches(/^[6-9]\d{9}$/, 'Please enter a valid phone number.')
        .required('Phone number is required')
    }),
    onSubmit: async (values) => {
      const trimmedName = values.name.trim();
      try {
        const formData = new FormData();
        formData.append("user_id", userDetails.user_id);
        formData.append("name", trimmedName);
        formData.append("phone", values.phone);
        let newProfileIMG = null;

        if (userSelectedImg instanceof File) {
          formData.append("profile", userSelectedImg);
          newProfileIMG = userSelectedImg.name;
        } else if (selectedDefaultimgIndex !== null) {
          formData.append("defaultProfileImage", userSelectedImg);
          newProfileIMG = userSelectedImg.split("/").pop();
        }

        await userAxiosInstance.patch("/editprofile", formData);
        const updatedDetails = { ...userDetails, name: trimmedName, phone: values.phone, profileIMG: newProfileIMG || userDetails.profileIMG };
        setUserDetails(updatedDetails);
        cancelEdit();
        toast.success("Profile updated successfully");
        localStorage.setItem("userDetails", JSON.stringify(updatedDetails));
      } catch (error) {
        if (error.response?.status === 301) {
          toast.warning("No changes found.");
        } else if (error.response?.status === 401) {
          setIsLogged(false);
          navigate("/login", { state: { message: "Authorization failed, please login." } });
        } else {
          console.error("Error:", error);
          toast.error("Something went wrong, please try again later.");
        }
      }
    }
  });

  const handleChooseIMG = (index) => {
    setSelectedDefaultimgIndex(index);
    setUserSelectedImg(defaultImages[index]);
  };

  const handleFileChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      setUserSelectedImg(file);
      setSelectedDefaultimgIndex(null);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <li className="list-group-item border-0 p-4 mb-2 mt-3 bg-gray-100 border-radius-lg">
      <div className="text-center position-relative">
        <img src={
          userSelectedImg instanceof File
            ? URL.createObjectURL(userSelectedImg)
            : userSelectedImg || `${Base_URL}/${userDetails?.profileIMG}`
        } width="120" height="120" className="rounded-circle" alt="User Profile" />
      </div>
      <h6 className="mb-3 text-xs mt-4 text-center">Change profile icon</h6>
      <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
        {defaultImages.map((img, index) => (
          <img key={index} src={img} width="50" className={`rounded-circle ${selectedDefaultimgIndex === index ? 'opacity-4' : ''}`} alt="Default Profile" onClick={() => handleChooseIMG(index)} />
        ))}
      </div>
      <div className="d-flex justify-content-center">
        <button className="btn btn-sm px-1 mt-2 btn-outline-primary" onClick={triggerFileSelect}>Choose from files</button>
        <input type="file" ref={fileInputRef} hidden accept=".png, .jpeg, .jpg" onChange={handleFileChange} />
      </div>
      <form onSubmit={formik.handleSubmit}>
        <input type="text" className="form-control mt-3" placeholder="Name" {...formik.getFieldProps('name')} />
        {formik.touched.name && formik.errors.name ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.name}</div> : null}
        <input type="text" className="form-control mt-3" placeholder="Phone Number" {...formik.getFieldProps('phone')} />
        {formik.touched.phone && formik.errors.phone ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.phone}</div> : null}
        <div className="ms-auto mt-3 text-end">
          <button type="button" className="btn text-xs btn-outline-primary border-radius-xl me-1" onClick={cancelEdit}>Cancel</button>
          <button type="submit" className="btn text-xs bg-gradient-primary border-radius-xl">Save</button>
        </div>
      </form>
    </li>
  );
};

export default EditUserInfo;