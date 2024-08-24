import React, { useEffect, useState } from 'react';
import BackgroundShape from '../Common/backgroundShape';
import UserNavbar from '../User_side/NavbarPage';
import confirmAlert from '../Common/SweetAlert/confirmAlert';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Backbtn } from '../../../public/svgs/Icons';
import userAxiosInstance from '../../config/AxiosInstance/userInstance';
import { useUserDetails } from '../../Contexts/UserDetailsContext';

const TechnicianRole = () => {
  const { userDetails, setUserDetails } = useUserDetails();
  const professions = ["Painter", "Welder", "Electrician", "Plumber", "Automobile Mechanic", "AC Mechanic", "Other"];
  const [selectedProfessionIndex, setSelectedProfessionIndex] = useState(null);
  const [enteredOtherProfession, setEnteredOtherProfession] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUserDetails(JSON.parse(sessionStorage.getItem("userDetails")));
    if (location.state?.message) {
      toast.error(location.state?.message);
    }
  }, []);

  const handleSave = () => {
    if (selectedProfessionIndex === null) {
      toast.error("Choose your correct profession.");
      return;
    }
    let finalProfession = professions[selectedProfessionIndex];
    if (finalProfession === "Other") {
      const professionRegex = /^[A-Za-z\s]+$/;
      if (enteredOtherProfession.trim().length < 3 || enteredOtherProfession.trim().length > 20) {
        toast.warning("Profession must be between 3 and 20 characters.");
        return;
      } else if (!professionRegex.test(enteredOtherProfession)) {
        toast.warning("Profession only supports alphabets.");
        return;
      } else {
        finalProfession = enteredOtherProfession;
      }
    }

    confirmAlert("Save your professions?")
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
            const response = await userAxiosInstance.patch(`/technician/joinTechnician?user_id=${userDetails?.user_id}&profession=${finalProfession}`);
            userDetails.isTechnician = true;
            userDetails.technicianDetails.push(response.data);
            sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
            setUserDetails(userDetails);
            navigate("/technician");
          } catch (error) {
            if (error.response.status === 401) {
              navigate("/login", { state: { message: "Authorization failed please login" } });
            } else {
              console.log(error);
              toast.warning("Something wrong please try again later");
            }
          }
        }
      });
  };

  return (
    <>
      <UserNavbar />
      <div className="page-header min-vh-75">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
              <div className="mt-5">
                {!userDetails?.isTechnician ? (
                  <div className="text-center mt-3">
                    <h5 className='w-70 text-start'><span onClick={() => navigate("/")}><Backbtn /></span>Profession </h5>
                    <p className='w-70 text-start text-sm'>Choose your correct Profession </p>
                    <br />
                    {professions.map((prof, index) => (
                      <p
                        key={index}
                        className='w-70 text-start border-radius-md mb-1 p-1 px-3'
                        style={{ backgroundColor: index === selectedProfessionIndex ? "#FBECEC" : "#f2f2f2", cursor: "pointer" }}
                        onClick={() => setSelectedProfessionIndex(index)}>
                        {prof}
                      </p>
                    ))}
                    {professions[selectedProfessionIndex] === "Other" && (
                      <input type="text" className='form-control mt-4 w-70' placeholder="Enter your profession" onChange={(e) => setEnteredOtherProfession(e.target.value)} />
                    )}
                    <div className='d-flex mt-4'>
                      <button className="btn bg-gradient-primary px-4 mx-1 w-30" onClick={handleSave}>Next</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h5 className='text-start'>You have already submitted the details.</h5>
                    <p className='text-start'>Click the "Home" button to access your technician console.</p>
                    <button className="btn bg-gradient-primary mt-3 w-50" onClick={navigate("/technician")}>Go to Home Page</button>
                  </>
                )}
              </div>
            </div>
            <BackgroundShape />
          </div>
        </div>
      </div>
    </>
  );
};

export default TechnicianRole;