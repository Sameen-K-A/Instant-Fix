import React, { useEffect, useState } from 'react';
import UserNavbar from './NavbarPage';
import backgroundImage from "/images/HeaderBanner_2.png";
import { Base_URL } from '../../config/credentials';
import { CloseX_mark, FollowTechnician, MsgToTechnician, Star } from '../../../public/svgs/Icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import userAxiosInstance from "../../config/AxiosInstance/userInstance";
import image from "../../../public/images/profile_2.jpg";

const TechnicianProfileDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [technicianDetails, setTechnicianDetails] = useState(null);
  const [bookingInformation, setBookingInformation] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const details = location.state.details;
        const userInformation = JSON.parse(sessionStorage.getItem("userDetails"));
        setTechnicianDetails(details);
        const response = await userAxiosInstance.get("/fetchAnyPendingRequestAvailable", {
          params: {
            clientID: userInformation?.user_id,
            technicianUserID: details?.user_id
          }
        });
        setBookingInformation(response.data);
      } catch (error) {
        if (error.response.status === 401) {
          navigate("/login", { state: { message: "Authorization failed, please login" } });
        } else {
          toast.error("Can't fetch previous booking status");
        }
      }
    })();
  }, []);

  const handleMessageOpen = () => {
    navigate("/chat", { state: { details: technicianDetails } });
  };

  return (
    <>
      <UserNavbar />
      <div className="container-fluid pe-6 row d-flex justify-content-between mx-4">
        <div className="col-lg-3 col-md-5 col-12">
          <div className="d-flex flex-column align-items-center justify-content-center min-vh-85">
            <img src={`${Base_URL}/${technicianDetails?.profileIMG}`} alt="profile_image" className='rounded-circle w-50 m-3' />
            <h5 className="mb-1 text-dark">{technicianDetails?.name}</h5>
            <p className="m-0 text-sm">{technicianDetails?.technicianDetails?.profession}</p>
            <div className="d-flex justify-content-center m-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <strong key={value} className='me-1'>{value <= technicianDetails?.technicianDetails?.rating ? <Star color={"#ffbb00"} /> : <Star />}</strong>
              ))}
            </div>
            <ul className="nav nav-fill bg-transparent d-flex m-3">
              <button className='btn btn-outline-primary px-3 mx-1 mb-0'><FollowTechnician /></button>
              <button className='btn btn-outline-primary px-3 mx-1 mb-0' onClick={handleMessageOpen}><MsgToTechnician /></button>
              {bookingInformation ? (
                <button className='btn bg-gradient-primary mx-1 mb-0' onClick={() => navigate("/bookingHistory")}>View Booking history</button>
              ) : (
                <button className='btn bg-gradient-primary mx-1 mb-0' onClick={() => setIsBookingOpen(true)}>Book Now</button>
              )}
            </ul>
          </div>
        </div>
        <div className="col-lg-9 col-md-7 col-12">
          <nav className="bg-transparent shadow-none position-absolute ps-5 mt-5 w-100 z-index-2">
            <h6 className="text-dark font-weight-bolder mb-0">Technician Profile</h6>
            <p className="text-xs mt-0 text-black-65">Technician/ Profile details</p>
          </nav>
          <div className="page-header min-height-200 border-radius-xl mt-4 me-4" style={{ backgroundImage: `url(${backgroundImage})` }} />
          <div className="row d-flex justify-content-between mx-4">
            <div className="col-lg-7 col-sm-12">
              <div className="card card-body blur-sm mt-n5 min-height-500">
                
              </div>
            </div>


            <div className="col-lg-5 col-sm-12">
              <div className="card card-body blur-sm mt-n5 py-2">
                <h6 className="mb-0 mt-3 text-center">Feedbacks</h6>
                <div className="p-3 max-height-400" style={{ overflowY: 'auto' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => {
                    return (
                      <li className="list-group-item border-0 d-flex p-3 mb-1 mt-3 bg-gray-100 border-radius-lg align-items-center" key={val}>
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
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='booking-div position-fixed start-0 w-100 card card-body blur' style={{ bottom: isBookingOpen ? 0 : '-85%', height: isBookingOpen ? '85%' : '0px', zIndex: 9999, transition: 'bottom 0.3s ease, height 0.3s ease', boxShadow: '0 -5px 15px rgba(0, 0, 0, 0.3)' }}>
        <div className="d-flex justify-content-end">
          <p className='mx-1 cursor-pointer' onClick={() => setIsBookingOpen(false)}><CloseX_mark /></p>
        </div>
      </div>
    </>
  );
};

export default TechnicianProfileDetails;
