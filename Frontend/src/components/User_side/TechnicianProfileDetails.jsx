import React, { useEffect, useState } from 'react';
import UserNavbar from './NavbarPage';
import backgroundImage from "/images/Login&RegisterBackground.jpg";
import { Base_URL } from '../../config/credentials';
import { FollowTechnician, MsgToTechnician, Star } from '../../../public/svgs/Icons';
import { useLocation, useNavigate } from 'react-router-dom';

const TechnicianProfileDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [technicianDetails, setTechnicianDetails] = useState(null);
  useEffect(() => {
    const details = location.state.details;
    setTechnicianDetails(details);
  }, []);

  const handleMessageOpen = () => {
    navigate("/chat", { state: { details: technicianDetails } });
  }

  return (
    <>
      <UserNavbar />
      <div className="container-fluid">
        <div className="page-header min-height-200 border-radius-xl mt-4" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <span className="mask bg-gradient-primary opacity-8"></span>
        </div>
        <div className="card card-body col-lg-6 col-md-8 blur shadow-blur mx-auto mt-n7 overflow-hidden">
          <div className='d-flex justify-content-center'>
            <div className="avatar avatar-xxl mb-3 ">
              <img src={`${Base_URL}/${technicianDetails?.profileIMG}`} alt="profile_image" className="w-100 border-radius-lg shadow-sm" />
            </div>
          </div>
          <div className="text-center">
            <h5 className="mb-1 text-dark">{technicianDetails?.name}</h5>
            <h6 className="mb-1 text-dark text-md">{technicianDetails?.technicianDetails[0]?.profession}</h6>
            {[1, 2, 3, 4, 5].map((value) => (
              <strong key={value} className='me-1'>{value <= technicianDetails?.technicianDetails[0]?.rating ? <Star color={"#ffbb00"} /> : <Star />}</strong>
            ))}
            <p className="mt-2 text-sm">{technicianDetails?.email}</p>
          </div>
          <div className="gap-2 d-flex justify-content-center">
            <button className='btn btn-outline-primary px-3'><FollowTechnician /></button>
            <button className='btn btn-outline-primary px-3' onClick={() => handleMessageOpen()}><MsgToTechnician /></button>
            <button className='btn bg-gradient-primary'>Book Now</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TechnicianProfileDetails;
