import React, { useEffect, useState } from 'react';
import backgroundImage from "/images/Login&RegisterBackground.jpg";
import { Base_URL } from '../../config/credentials';
import UserNavbar from './NavbarPage';
import UserInformation from './User-Personal details/UserInfo';
import AddressInformation from './User-Personal details/AddressInfo';
import FollowingInformation from './User-Personal details/FollowingInfo';

const AccountDetails = () => {
   const [userDetails, setUserDetails] = useState(null);
   useEffect(() => {
      setUserDetails(JSON.parse(sessionStorage.getItem("userDetails")));
   }, [])
   return (
      <>
         <UserNavbar />
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
                     </div>
                  </div>
               </div>
            </div>
            <div className="container-fluid py-4">
               <div className="row">
                  <UserInformation />
                  <AddressInformation />
                  <FollowingInformation />
               </div>
            </div>
         </div>
      </>
   );
};

export default AccountDetails;