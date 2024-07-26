import React, { useEffect, useState } from 'react';
import BackgroundShape from '../Common/backgroundShape';
import UserNavbar from '../User_side/NavbarPage';
import { Base_URL } from '../../config/credentials';
import confirmAlert from '../Common/SweetAlert/confirmAlert';
import axios from "axios";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const TechnicianRole = () => {
  const [userDetails, setUserDetails] = useState({});
  const professions = ["Painter", "Welder", "Electrician", "Plumber", "Automobile Mechanic", "AC Mechanic", "Other"];
  const [selectedProfessionIndex, setSelectedProfessionIndex] = useState(1);
  const [enteredOtherProfession, setEnteredOtherProfession] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setUserDetails(JSON.parse(sessionStorage.getItem("userDetails")));
  }, []);

  const handleSave = () => {
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
            const response = await axios.patch(`${Base_URL}/technician/joinTechnician?user_id=${userDetails?.user_id}&profession=${finalProfession}`);
            console.log(response.data);
            if (response.status === 200) {
              const technicianDetails = JSON.stringify(response.data.seriveResult);
              sessionStorage.setItem("technicianDetails", technicianDetails);
              const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
              userDetails.isTechnician = true;
              sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
              navigate("/technician");
            } else {
              toast.error("Failed to save technician details.");
            }
          } catch (error) {
            toast.error("Something wrong please try again later.");
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
                    <h5 className='w-70 text-start'>Choose your Profession </h5>
                    <br />
                    {professions.map((prof, index) => (
                      <p
                        key={index}
                        className='w-70 text-start border-radius-md mb-1 p-1 px-3'
                        style={{ backgroundColor: index === selectedProfessionIndex ? "#f1ccff" : "#f2f2f2", cursor: "pointer" }}
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