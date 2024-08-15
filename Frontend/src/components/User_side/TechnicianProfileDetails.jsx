import React, { useEffect, useState } from 'react';
import UserNavbar from './NavbarPage';
import backgroundImage from "/images/Login&RegisterBackground.jpg";
import { Base_URL } from '../../config/credentials';
import { FollowTechnician, MsgToTechnician, Star } from '../../../public/svgs/Icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import userAxiosInstance from "../../config/AxiosInstance/userInstance";
import image from "../../../public/images/profile_2.jpg";
import BookingConfirmModal from './BookingConfirmModal';

const TechnicianProfileDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [technicianDetails, setTechnicianDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [bookingInformation, setBookingInformation] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const details = location.state.details;
        const userInformation = JSON.parse(sessionStorage.getItem("userDetails"));
        setUserDetails(userInformation);
        setTechnicianDetails(details);
        const response = await userAxiosInstance.get("/fetchAnyPendingRequestAvailable", {
          params: {
            clientID: userInformation?.user_id,
            technicianUserID: details?.user_id
          }
        });
        setBookingInformation(response.data);
      } catch (error) {
        toast.error("Can't fetch previous booking status");
      }
    })();
  }, []);

  const handleMessageOpen = () => {
    navigate("/chat", { state: { details: technicianDetails } });
  };

  return (
    <>
      <UserNavbar />
      <div className="container-fluid pe-6">
        <div className="page-header min-height-200 border-radius-xl mt-4" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <span className="mask bg-gradient-primary opacity-8"></span>
        </div>
        <div className="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
          <div className="row gx-4">
            <div className="col-auto">
              <div className="avatar avatar-xl position-relative">
                <img src={`${Base_URL}/${technicianDetails?.profileIMG}`} alt="profile_image" className="w-100 h-100 border-radius-lg shadow-sm" />
              </div>
            </div>
            <div className="col-auto my-auto">
              <div className="h-100">
                <h5 className="mb-1 text-dark">{technicianDetails?.name}</h5>
                <p className="m-0 text-sm">{technicianDetails?.technicianDetails[0]?.profession}</p>
                {[1, 2, 3, 4, 5].map((value) => (
                  <strong key={value} className='me-1'>{value <= technicianDetails?.technicianDetails[0]?.rating ? <Star color={"#ffbb00"} /> : <Star />}</strong>
                ))}
              </div>
            </div>
            <div className="col-lg-4 px-5 col-md-4 my-auto ms-auto">
              <ul className="nav nav-fill bg-transparent d-flex justify-content-end">
                <button className='btn btn-outline-primary px-3 mx-1 mb-0'><FollowTechnician /></button>
                <button className='btn btn-outline-primary px-3 mx-1 mb-0' onClick={handleMessageOpen}><MsgToTechnician /></button>
              </ul>
            </div>
          </div>
        </div>
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-12 col-xl-6 mb-2">
              <div className="card col-12 min-height-200">
                <div className="card-header pb-0 p-3">
                  <h6 className="mb-0 mt-3 text-center">Feedbacks</h6>
                </div>
                <div className='p-2'>
                  <div className="card-body p-3" style={{ overflowY: 'auto', maxHeight: "285px" }}>
                    <li className="list-group-item border-0 d-flex p-3 mb-1 mt-3 bg-gray-100 border-radius-lg align-items-center">
                      <a className="avatar rounded-circle me-3">
                        <img alt="Image placeholder" src={image} />
                      </a>
                      <div className="flex-grow-1 d-flex justify-content-between align-items-center">
                        <div>
                          <p className="text-bold text-sm m-0">User name</p>
                          <p className="text-xs mt-1 m-0">User feedback</p>
                        </div>
                        <p className="text-xs m-0 text-black-50">Date</p>
                      </div>
                    </li>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-xl-6 mb-4">
              <div className="card col-12">
                <div className="card-header pb-0 p-3">
                  <h6 className="mb-0 mt-3 text-center">Your Address details</h6>
                </div>
                <div className="card-body p-4 min-height-300">
                  <li className="list-group-item border-0 d-flex p-4 mb-2 mt-4 bg-gray-100 border-radius-lg">
                    {userDetails?.addressDetails ? (
                      <div className="d-flex flex-column">
                        <span className="mb-2 text-xs text-dark">{userDetails?.addressDetails?.name},</span>
                        <span className="mb-2 text-xs text-dark">{userDetails?.addressDetails?.address}</span>
                        <span className="mb-2 text-xs text-dark">{userDetails?.addressDetails?.district}, <span className='mx-2'>{userDetails?.addressDetails?.state}</span></span>
                        <span className="mb-2 text-xs text-dark">{userDetails?.addressDetails?.pincode}</span>
                        <span className="mb-2 text-xs text-dark">{userDetails?.addressDetails?.phone}, <span className='mx-2'>{userDetails?.addressDetails?.alternatePhone}</span></span>
                      </div>
                    ) : (
                      <div>
                        <h6 className="text-dark">Address not found</h6>
                        <p className="text-sm text-black-50 mb-2">To add your address, follow these steps:</p>
                        <ul className="text-sm text-black-50">
                          <li>Tap on your profile in the top right corner.</li>
                          <li>Click on "Account Details."</li>
                          <li>Add your address.</li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <div className='d-flex justify-content-end mt-4'>
                    {bookingInformation ? (
                      <button className='btn bg-gradient-primary mx-1 mb-0' onClick={() => navigate("/bookingHistory")}>View Booking history</button>
                    ) : (
                      <button className='btn bg-gradient-primary mx-1 mb-0' data-bs-toggle="modal" data-bs-target="#bookingConfirmModal">Book Now</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BookingConfirmModal userDetails={userDetails} setBookingInformation={setBookingInformation} technicianDetails={technicianDetails} />
    </>
  );
};

export default TechnicianProfileDetails;