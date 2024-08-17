import React from 'react';
import { Base_URL } from '../../config/credentials';
import { Star } from '../../../public/svgs/Icons';
import { useNavigate } from 'react-router-dom';

const TechnicianProfileCard = ({ technicianData }) => {

  const navigate = useNavigate();
  const handleViewTechnician = (details) => {
    navigate("/techniciandetails", { state: { details: details } });
  };
  const ratingArray = [1, 2, 3, 4, 5];

  return (
    <div className="col-12 col-sm-6 col-lg-3 mt-4">
      <div className="card text-center">
        <div className='p-3 d-flex align-items-center justify-content-center'>
          <div className="avatar avatar-xxl mt-3">
            <img src={`${Base_URL}/${technicianData?.profileIMG}`} alt="profile_image" className="w-100 border-radius-lg shadow-sm" />
          </div>
        </div>
        <div className="card-body p-3 card-details">
          <h6 className="card-title text-dark mb-0">{technicianData?.name}</h6>
          <p className="card-text text-black-65 text-sm text-bold mb-0">{technicianData.technicianDetails[0]?.profession}</p>
          <div className="d-flex justify-content-center mb-3">
            {ratingArray.map((value) => {
              return (
                <span key={value} className='me-1'>
                  {value <= technicianData.technicianDetails[0]?.rating ? <Star color={"#ffbb00"} /> : <Star />}
                </span>
              )
            })}
          </div>
          <button type="button" className="btn bg-gradient-primary" onClick={() => handleViewTechnician(technicianData)}>View more</button>
        </div>
      </div>
    </div>
  );
};

export default TechnicianProfileCard;