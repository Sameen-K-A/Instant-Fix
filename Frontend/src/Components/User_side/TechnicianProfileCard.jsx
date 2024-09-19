import React, { useState } from 'react';
import { Star } from '../../../public/svgs/Icons';
import { useNavigate } from 'react-router-dom';

const TechnicianProfileCard = ({ technicianData }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
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
            {!imageLoaded && (
              <div className="border-radius-lg skeleton-loader" />
            )}
            <img src={technicianData?.profileIMG} alt="profile_image" style={{ display: imageLoaded ? 'block' : 'none' }} className="w-100 border-radius-lg shadow-sm" onLoad={() => setImageLoaded(true)} />
          </div>
        </div>
        <div className="card-body p-3 card-details">
          <h6 className="card-title text-dark mb-0">{technicianData?.name}</h6>
          <p className="card-text text-black-65 text-sm text-bold mb-0">{technicianData.technicianDetails?.profession}</p>
          <div className="d-flex justify-content-center mb-3">
            {ratingArray.map((value) => (
              <span key={value} className='me-1'>
                {value <= technicianData.technicianDetails?.rating ? (
                  <Star color={"#ffbb00"} />
                ) : (
                  <Star />
                )}
              </span>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => handleViewTechnician(technicianData)}
          >
            View more
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicianProfileCard;
