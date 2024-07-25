import React, { useEffect, useState } from 'react';
import BackgroundShape from '../Common/backgroundShape';
import UserNavbar from '../User_side/NavbarPage';
import { Base_URL } from '../../config/credentials';
import confirmAlert from '../Common/SweetAlert/confirmAlert';
import axios from "axios";

const TechnicianRole = () => {

  const [userDetails, setUserDetails] = useState({});
  const professions = ["Painter", "Welder", "Housekeeping", "Gardener", "Electrician", "Plumber", "Automobile Mechanic", "AC Mechanic"];
  const [selectedProfessionIndex, setSelectedProfessionIndex] = useState(2);
  useEffect(() => {
    setUserDetails(JSON.parse(sessionStorage.getItem("userDetails")));
  }, []);

  const handleSave = () => {
    confirmAlert("Save your professions?")
      .then(async (result) => {
        if (result.isConfirmed) {
          const selectedProfession = professions[selectedProfessionIndex];
          const response = await axios.patch(`${Base_URL}/technician/joinTechnician?user_id=${userDetails?.user_id}&profession=${selectedProfession}`);
          console.log(response.data);
        }
      })
  }

  return (
    <>
      <UserNavbar />
      <div className="page-header min-vh-75">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
              <div className="mt-5">
                {userDetails && (
                  <div className="text-center mt-3">
                    <h5 className='w-70 text-start'>Choose your Profession </h5>
                    <br />
                    {professions.map((prof, index) => {
                      return (
                        <p
                          key={index + 1}
                          className='w-70 text-start border-radius-md mb-1 p-1 px-3'
                          style={{ backgroundColor: index == selectedProfessionIndex ? "#f1ccff" : "#f2f2f2", cursor: "pointer" }}
                          onClick={() => setSelectedProfessionIndex(index)}>
                          {prof}
                        </p>
                      )
                    })}
                    <div className='d-flex mt-4'>
                      <button className="btn bg-gradient-primary px-4 mx-1 w-30" onClick={() => handleSave()}>Next</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <BackgroundShape />
          </div>
        </div>
      </div>
    </>
  );
}

export default TechnicianRole;
