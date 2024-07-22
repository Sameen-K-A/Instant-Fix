import React from 'react';

const TechnicianProfileCard = () => {
  return (
    <div className="col-12 col-sm-6 col-lg-3 mt-5">
      <div className="card text-center">
        <div className='p-3 d-flex align-items-center justify-content-center'>
          <div className="rounded-circle overflow-hidden" style={{ width: "150px", height: "150px" }}>
            <img src="https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001884.png" width={"150px"} alt="Technician Profile" />
          </div>
        </div>
        <div className="card-body p-3 card-details">
          <h6 className="card-title">Samantha Sarah</h6>
          <p className="card-text text-muted mb-2">Founder & CEO</p>
          <button type="button" className="btn bg-gradient-primary">View more</button>
        </div>
      </div>
    </div>
  );
};

export default TechnicianProfileCard;