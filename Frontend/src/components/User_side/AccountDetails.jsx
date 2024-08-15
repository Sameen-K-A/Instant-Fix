import React, { useEffect, useState } from 'react';
import UserNavbar from './NavbarPage';
import TechnicianNavbar from '../Technician_side/NavbarPage';
import UserInformation from './User-Personal details/UserInfo';
import AddressInformation from './User-Personal details/AddressInfo';
import FollowingInformation from './User-Personal details/FollowingInfo';
import TechnicianFeedbacks from '../Technician_side/TechnicianFeedbacks';
import UserChangePassword from "./User-Personal details/ChangePassword";
import TechnicianChangeProfession from '../Technician_side/TechnicianChangeProfession';
import userAxiosInstance from '../../config/AxiosInstance/userInstance';
import backgroundImage from "/images/Login&RegisterBackground.jpg";
import { Base_URL } from '../../config/credentials';
import { useLocation } from 'react-router-dom';
import { AvailabilityDot, Star } from '../../../public/svgs/Icons';
import { toast } from 'sonner';

const AccountDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [nowTechnician, setNowTechnician] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setUserDetails(JSON.parse(sessionStorage.getItem("userDetails")));
    if (location.pathname === "/technician/accountdetails") {
      setNowTechnician(true);
    }
  }, []);

  const changeAvailabilityStatus = async (e) => {
    try {
      const changedStatus = e.target.value;
      await userAxiosInstance.patch("/technician/changeAvailabilityStatus", { user_id: userDetails.user_id, newStatus: changedStatus });
      const afterChanged = {
        ...userDetails, technicianDetails: [{ ...userDetails.technicianDetails[0], availability: changedStatus === "Active" ? true : false }]
      };
      sessionStorage.setItem("userDetails", JSON.stringify(afterChanged));
      setUserDetails(afterChanged);
      toast.success("Status changed successfully");
    } catch (error) {
      toast.error("Something wrong please try again later");
    };
  };

  return (
    <>
      {nowTechnician ? <TechnicianNavbar /> : <UserNavbar />}
      <nav className="bg-transparent shadow-none position-absolute ps-5 mt-5 w-100 z-index-2">
        <h6 className="text-white font-weight-bolder mb-0 ms-2">{nowTechnician && "Technician "}Account Details</h6>
        <p className="text-light text-sm text-white mt-0 ms-2">{nowTechnician ? "Profile/ Technician details" : "Profile/ Account Details"}</p>
      </nav>
      <div className="container-fluid pe-6">
        <div className="page-header min-height-200 border-radius-xl mt-4" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <span className="mask bg-gradient-primary opacity-8"></span>
        </div>
        <div className="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
          <div className="row gx-4">
            <div className="col-auto">
              <div className="avatar avatar-xl position-relative">
                <img src={`${Base_URL}/${userDetails?.profileIMG}`} alt="profile_image" className="w-100 h-100 border-radius-lg shadow-sm" />
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
              <div className="col-lg-4 px-5 col-md-4 my-auto ms-auto">
                <ul className="nav nav-fill bg-transparent d-flex justify-content-end">
                  <li className="nav-item mt-1">
                    <p className='text-sm text-bold mb-1 text-center'>Rating</p>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <strong key={value} className='me-1'>{value <= userDetails.technicianDetails[0]?.rating ? <Star color={"#ffbb00"} /> : <Star />}</strong>
                    ))}
                  </li>
                  <li className="nav-item px-3">
                    <p className='mb-0 text-sm mb-1 text-bold text-center'>Availability status</p>
                    <select
                      className="form-select"
                      value={userDetails.technicianDetails[0]?.availability ? "Active" : "Non active"}
                      onChange={(e) => changeAvailabilityStatus(e)}>
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
              <AddressInformation userDetails={userDetails} setUserDetails={setUserDetails} />
            </div>
            {nowTechnician ? <TechnicianFeedbacks /> : <FollowingInformation />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountDetails;