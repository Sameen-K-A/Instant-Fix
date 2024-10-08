import React, { useEffect, useState } from 'react';
import UserNavbar from './NavbarPage';
import TechnicianNavbar from '../Technician_side/NavbarPage';
import UserInformation from './User-Personal details/UserInfo';
import AddressInformation from './User-Personal details/AddressInfo'; 
import FollowingInformation from './User-Personal details/FollowingInfo'; 
import TechnicianFeedbacks from '../Technician_side/TechnicianFeedbacks';
import UserChangePassword from './User-Personal details/ChangePassword'; 
import TechnicianChangeProfession from '../Technician_side/TechnicianChangeProfession';
import userAxiosInstance from '../../Config/userInstance';
import backgroundImage from "../../../public/Images/HeaderBanner_2.png";
import { useLocation } from 'react-router-dom';
import { AvailabilityDot, Star } from '../../../public/svgs/Icons';
import { toast } from 'sonner';
import { useUserDetails } from '../../Contexts/UserDetailsContext';
import Reveal from "../../../public/Animation/Animated";
import ProfileImage from './User-Personal details/ProfileImage';

const AccountDetails = () => {
  const { userDetails, setUserDetails } = useUserDetails();
  const [nowTechnician, setNowTechnician] = useState(false);
  const location = useLocation();
  useEffect(() => {
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
      localStorage.setItem("userDetails", JSON.stringify(afterChanged));
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
        <h6 className="font-weight-bolder mb-0 ms-2">{nowTechnician && "Technician "}Account Details</h6>
        <p className="text-sm mt-0 ms-2">{nowTechnician ? "Profile/ Technician details" : "Profile/ Account Details"}</p>
      </nav>
      <div className={`container-fluid ${!nowTechnician && " pe-6"}`}>
        <div className="page-header min-height-200 border-radius-xl mt-4" style={{ backgroundImage: `url(${backgroundImage})` }} />
        <div className="card card-body blur-sm shadow-blur mx-4 mt-n6 overflow-hidden">
          <div className="row gx-4">
            <ProfileImage />
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
                    <select className="form-select" value={userDetails.technicianDetails[0]?.availability ? "Active" : "Non active"} onChange={(e) => changeAvailabilityStatus(e)}>
                      <option value="Active">Active</option>
                      <option value="Non active">Non active</option>
                    </select>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <Reveal>
          <div className="container-fluid py-4">
            <div className="row">
              <div className="col-12 col-xl-4 mb-4">

                <UserInformation />
                <UserChangePassword />
              </div>
              <div className="col-12 col-xl-4 mb-4">
                {nowTechnician && (
                  <TechnicianChangeProfession profession={userDetails.technicianDetails[0]?.profession} />
                )}
                <AddressInformation />
              </div>
              {nowTechnician ? <TechnicianFeedbacks /> : <FollowingInformation />}
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
};

export default AccountDetails;