import React, { useEffect, useState } from 'react';
import backgroundImage from "/images/Login&RegisterBackground.jpg";
import { Base_URL } from '../../config/credentials';
import UserNavbar from './NavbarPage';
import UserInformation from './User-Personal details/UserInfo';
import AddressInformation from './User-Personal details/AddressInfo';
import FollowingInformation from './User-Personal details/FollowingInfo';
import { useLocation } from 'react-router-dom';
import TechnicianNavbar from '../Technician_side/NavbarPage';
import TechnicianFeedbacks from '../Technician_side/TechnicianFeedbacks';
import { AvailabilityDot } from '../../../public/svgs/Icons';
import UserChangePassword from "./User-Personal details/ChangePassword";
import TechnicianChangeProfession from '../Technician_side/TechnicianChangeProfession';

const AccountDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [nowTechnician, setNowTechnician] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setUserDetails(JSON.parse(sessionStorage.getItem("userDetails")));
    if (location.pathname === "/technician/accountdetails") {
      setNowTechnician(true);
    }
  }, [])
  return (
    <>
      {nowTechnician ? <TechnicianNavbar /> : <UserNavbar />}
      <div className="container-fluid">
        <div className="page-header min-height-200 border-radius-xl mt-4" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <span className="mask bg-gradient-primary opacity-8"></span>
        </div>
        <div className="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
          <div className="row gx-4">
            <div className="col-auto">
              <div className="avatar avatar-xl position-relative">
                <img src={`${Base_URL}/${userDetails?.profileIMG}`} alt="profile_image" className="w-100 border-radius-lg shadow-sm" />
              </div>
            </div>
            <div className="col-auto my-auto">
              <div className="h-100">
                <h5 className="mb-1 text-dark">{userDetails?.name}</h5>
                <p className="mb-0 text-sm">{userDetails?.email}</p>
                {nowTechnician && (
                  <div className="d-flex justify-content-start align-items-center">
                    <AvailabilityDot color={userDetails.technicianDetails[0]?.availability ? "#00e6a1" : "#FF0000"} />
                    <p className="mb-0 text-sm">{userDetails.technicianDetails[0]?.availability ? "Active" : "Not active"}</p>
                  </div>
                )}
              </div>
            </div>
            {nowTechnician && (
              <div className="col-lg-2 px-5 col-md-4 my-auto ms-auto">
                <ul className="nav nav-fill bg-transparent">
                  <li className="nav-item">
                    <p className='mb-0 text-sm mb-1 text-bold'>Availability status</p>
                    <select
                      className="form-select"
                      defaultValue={userDetails.technicianDetails[0]?.availability ? "Active" : "Non active"}
                    // onChange={(e) => handleAvailabilityChange(e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Non active">Non active</option>
                    </select>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-12 col-xl-4 mb-4">
              <UserInformation userDetails={userDetails} setUserDetails={setUserDetails} />
              <UserChangePassword userDetails={userDetails} />
            </div>
            <div className="col-12 col-xl-4 mb-4">
              {nowTechnician && (
                <TechnicianChangeProfession profession={userDetails.technicianDetails[0]?.profession} userDetails={userDetails} setUserDetails={setUserDetails} />
              )}
              <AddressInformation />
            </div>
            {nowTechnician ? <TechnicianFeedbacks /> : <FollowingInformation />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountDetails;