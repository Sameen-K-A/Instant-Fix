import React, { useEffect, useState } from 'react';
import UserNavbar from './NavbarPage';
import backgroundImage from "/images/Login&RegisterBackground.jpg";
import { Base_URL } from '../../config/credentials';
import { FollowTechnician, MsgToTechnician, Star } from '../../../public/svgs/Icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import userAxiosInstance from "../../config/AxiosInstance/userInstance";

const TechnicianProfileDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [technicianDetails, setTechnicianDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [bookingInformation, setBookingInformation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
        toast.error("Can't fetchning previous booking status");
      }
    })();
  }, []);

  const handleMessageOpen = () => {
    navigate("/chat", { state: { details: technicianDetails } });
  };

  const bookTechnician = async () => {
    setIsLoading(true);
    try {
      const bookingResponse = await userAxiosInstance.post("/bookTechnician", { clientID: userDetails.user_id, technicianUserID: technicianDetails?.user_id });
      setBookingInformation(bookingResponse.data);
      toast.success("Booking request sended successfully, please wait for the confirmation.");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error.response.status === 401) {
        navigate("/login", { state: { message: "Authorization failed please login" } });
      } else if (error.response.status === 409) {
        toast.error("Booking failed. Please try again later");
      } else if (error.response.status === 404) {
        toast.error("Technician not available now, please connect other technician or please wait");
      } else {
        toast.error("Something wrong please try again later");
      }
    }
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
            <div className="avatar avatar-xxl mb-3 mt-3">
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
            {bookingInformation ? (
              <button className='btn bg-gradient-primary' onClick={() => navigate("/bookingHistory")}>Check booking history</button>
            ) : (
              isLoading ? (
                <button className='btn bg-gradient-primary'>Loading . . .</button>
              ) : (
                <button button className='btn bg-gradient-primary' onClick={() => bookTechnician()}>Book Now</button>
              )
            )}
          </div>
          {bookingInformation && (
            <p className='text-center text-sm mt-2'>You have already booked this technician. Click the <b>'Check Booking History'</b><br /> button to view more details about your booking.</p>
          )}
        </div>
      </div >
    </>
  );
};

export default TechnicianProfileDetails;