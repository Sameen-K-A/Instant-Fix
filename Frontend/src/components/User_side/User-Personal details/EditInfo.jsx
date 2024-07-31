import { useState, useRef } from "react";
import { Base_URL } from "../../../config/credentials";
import profileDefault_1 from "../../../../public/images/profile_1.jpg";
import profileDefault_2 from "../../../../public/images/profile_2.jpg";
import profileDefault_3 from "../../../../public/images/profile_3.jpg";
import profileDefault_4 from "../../../../public/images/profile_4.jpg";

const EditUserInfo = ({ userDetails, cancelEdit, saveChanges }) => {
  const [selectedDefaultimgIndex, setSelectedDefaultimgIndex] = useState(null);
  const [userSelectedImg, setUserSelectedImg] = useState(null);
  const fileInputRef = useRef(null);

  const defaultImages = [profileDefault_1, profileDefault_2, profileDefault_3, profileDefault_4];

  const handleChooseIMG = (index) => {
    setSelectedDefaultimgIndex(index);
    setUserSelectedImg(defaultImages[index]);
  };

  const handleFileChange = (event) => {
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
        <img
          src={
            userSelectedImg instanceof File
              ? URL.createObjectURL(userSelectedImg)
              : userSelectedImg || `${Base_URL}/${userDetails?.profileIMG}`
          }
          width="120"
          height="120"
          className="rounded-circle"
          alt="User Profile"
        />
      </div>
      <h6 className="mb-3 text-xs mt-4 text-center">Change profile icon</h6>
      <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
        {defaultImages.map((img, index) => (
          <img
            key={index}
            src={img}
            width="50"
            className={`rounded-circle ${selectedDefaultimgIndex === index ? 'opacity-4' : ''}`}
            alt="Default Profile"
            onClick={() => handleChooseIMG(index)}
          />
        ))}
      </div>
      <div className="d-flex justify-content-center">
        <button className="btn btn-sm px-1 mt-2 btn-outline-dark" onClick={triggerFileSelect}>
          Choose from files
        </button>
        <input type="file" ref={fileInputRef} hidden accept=".png, .jpeg, .jpg" onChange={handleFileChange} />
      </div>
      <input type="text" className="form-control mt-3" placeholder="Name" defaultValue={userDetails?.name} />
      <input type="text" className="form-control mt-3" placeholder="Phone Number" defaultValue={userDetails?.phone} />
      <div className="ms-auto mt-3 text-end">
        <button className="btn text-xs btn-outline-dark border-radius-xl me-1" onClick={cancelEdit}>Cancel</button>
        <button className="btn text-xs bg-gradient-primary border-radius-xl" onClick={saveChanges}>Save</button>
      </div>
    </li>
  );
};

export default EditUserInfo;