import React, { useEffect, useState } from 'react';
import UserNavbar from './NavbarPage'; 
import backgroundImage from "../../../public/Images/HeaderBanner_2.png";
import { CloseX_mark, FollowTechnician, MsgToTechnician, Star } from '../../../public/svgs/Icons';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingConfirmModalDetails from './BookingConfirmModal';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'sonner';
import userAxiosInstance from '../../Config/AxiosInstance/userInstance'; 
import { RiUserFollowFill } from "react-icons/ri";
import { useUserDetails } from '../../Contexts/UserDetailsContext'; 
import Reveal from '../../../public/Animation/Animated';
import { useUserAuthContext } from '../../Contexts/UserAuthContext';

const TechnicianProfileDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userDetails, setUserDetails } = useUserDetails();
  const userSavedTechnicians = userDetails.savedTechnicians;
  const [technicianDetails, setTechnicianDetails] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { setIsLogged } = useUserAuthContext();

  useEffect(() => {
    (async () => {
      try {
        const details = location.state.details;
        const response = await userAxiosInstance.get("/fetchTechnicianIndividualInformation", { params: { technicianUser_id: details?.user_id } });
        setTechnicianDetails(response.data);
        const availableDatesFromTechnicianSide = response.data?.technicianDetails?.availableSlots;
        setAvailableDates(availableDatesFromTechnicianSide.map((slotInto) => slotInto.slotBooked === false && slotInto.slotDate));
      } catch (error) {
        if (error.response.status === 401) {
          setIsLogged(false);
          navigate("/login", { state: { message: "Authorization failed, please login" } });
        } else {
          toast.error("Something went wrong, can't find the technician information. Please try again later.");
        };
      };
    })();
  }, [bookingSuccess]);

  const handleDateChange = (changedDate) => {
    const date = changedDate.toLocaleDateString('en-CA');
    setSelectedDate((prevSelectedDate) => prevSelectedDate === date ? null : date);
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateStr = date.toLocaleDateString('en-CA');
    const todayStringDate = today.toLocaleDateString('en-CA');
    return todayStringDate > dateStr || !availableDates.includes(dateStr);
  };

  const handleMessageOpen = () => {
    navigate("/chat", { state: { details: technicianDetails } });
  };

  const saveTechnician = async () => {
    try {
      await userAxiosInstance.patch("/saveTechnician", { technicianId: technicianDetails.user_id, user_id: userDetails.user_id });
      const updatedSavedTechnicians = [...userDetails.savedTechnicians, technicianDetails.user_id];
      const afterFollowedComplete = { ...userDetails, savedTechnicians: updatedSavedTechnicians };
      localStorage.setItem("userDetails", JSON.stringify(afterFollowedComplete));
      setUserDetails(afterFollowedComplete);
    } catch (error) {
      toast.error("Can't save technician. Please try again later");
    };
  };

  const unSaveTechnician = async () => {
    try {
      await userAxiosInstance.patch("/unSaveTechnician", { technicianId: technicianDetails.user_id, user_id: userDetails.user_id });
      const updatedUnSavedTechnicians = userSavedTechnicians.filter((technician_id) => technician_id !== technicianDetails.user_id);
      const afterUnSaveComplete = { ...userDetails, savedTechnicians: updatedUnSavedTechnicians };
      localStorage.setItem("userDetails", JSON.stringify(afterUnSaveComplete));
      setUserDetails(afterUnSaveComplete);
    } catch (error) {
      toast.error("Can't unsave technician. Please try again later");
    };
  };

  return (
    <>
      <UserNavbar />
      <div className="row me-4">
        <div className="container-fluid row d-flex justify-content-between">
          <div className="col-lg-3 col-md-5 col-12">
            <div className="d-flex flex-column align-items-center justify-content-center min-vh-85">
              <img src={`${technicianDetails?.profileIMG}`} alt="profile_image" className='rounded-circle w-50 m-3' />
              <h5 className="mb-1 text-dark">{technicianDetails?.name}</h5>
              <p className="m-0 text-sm">{technicianDetails?.technicianDetails?.profession}</p>
              <div className="d-flex justify-content-center m-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <strong key={value} className='me-1'>{value <= technicianDetails?.technicianDetails?.rating ? <Star color={"#ffbb00"} /> : <Star />}</strong>
                ))}
              </div>
              {technicianDetails !== null && (
                <ul className="nav nav-fill bg-transparent d-flex m-3">
                  {userSavedTechnicians.includes(technicianDetails.user_id) ? (
                    <button className='btn btn-outline-primary px-3 mx-1 mb-0' onClick={unSaveTechnician}><RiUserFollowFill size={"16px"} /></button>
                  ) : (
                    <button className='btn btn-outline-primary px-3 mx-1 mb-0' onClick={saveTechnician}><FollowTechnician /></button>
                  )}
                  <button className='btn btn-outline-primary px-3 mx-1 mb-0' onClick={handleMessageOpen}><MsgToTechnician /></button>
                  <button className='btn bg-gradient-primary mx-1 mb-0' onClick={() => setIsBookingOpen(true)}>Book Now</button>
                </ul>
              )}
            </div>
          </div>
          <div className="col-lg-9 col-md-7 col-12">
            <nav className="bg-transparent shadow-none position-absolute ps-5 mt-5 w-100 z-index-2">
              <h6 className="text-dark font-weight-bolder mb-0">Technician Profile</h6>
              <p className="text-xs mt-0 text-black-65">Technician/ Profile details</p>
            </nav>
            <div className="page-header min-height-200 border-radius-xl mt-4" style={{ backgroundImage: `url(${backgroundImage})` }} />
            <div className="row d-flex justify-content-between mx-1">
              <div className="col-lg-7 col-sm-12 mb-6">
                <div className="card card-body blur-sm mt-n5">
                  <Reveal>
                    <Calendar
                      onChange={handleDateChange}
                      tileDisabled={({ date }) => isDateDisabled(date)}
                      tileClassName={({ date }) => {
                        const dateStr = date.toLocaleDateString('en-CA');
                        if (selectedDate === dateStr) {
                          return 'selected-date';
                        }
                        return availableDates.includes(dateStr) ? 'available-date' : 'disabled-date';
                      }}
                    />
                  </Reveal>
                  <hr className="horizontal dark m-0 mt-2" />
                  <p className='text-sm mt-3 mb-4 px-2'><strong>NOTE: </strong> Please select an available date if you want service from this technician.</p>
                  <div className="d-flex align-items-center ms-2">
                    <div className="d-flex align-items-center me-3">
                      <div className="instruction-dot" style={{ backgroundColor: "#A7F3B3" }}></div>
                      <span className='text-xs ms-1 mb-0'>Selected</span>
                    </div>
                    <div className="d-flex align-items-center me-3">
                      <div className="instruction-dot" style={{ backgroundColor: "#ffffff" }}></div>
                      <span className='text-xs ms-1 mb-0'>Available</span>
                    </div>
                    <div className="d-flex align-items-center me-3">
                      <div className="instruction-dot" style={{ backgroundColor: "#00000030" }}></div>
                      <span className='text-xs ms-1 mb-0'>Not available</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 col-sm-12 mb-7">
                <div className="card card-body blur-sm mt-n5 py-2">
                  <Reveal>
                    <h6 className="mb-0 mt-3 text-center">Feedbacks</h6>
                    {technicianDetails?.ratingInformation?.reviews.length === 0 ? (
                      <div className="card-body p-5">
                        <p className="text-center text-xs mb-6 mt-6"><strong className='text-sm'>No Feedbacks founded </strong></p>
                      </div>
                    ) : (
                      <div className="p-1" style={{ overflowY: 'auto', maxHeight: "470px" }}>
                        {technicianDetails?.ratingInformation?.reviews.map((feedback, index) => {
                          return (
                            <li className="list-group-item border-0 d-flex p-3 mb-1 mt-3 bg-gray-100 border-radius-lg align-items-center" key={index + 1}>
                              <a className="avatar rounded-circle me-3">
                                <img alt="Image placeholder" src={`${feedback?.reviewerProfileIMG}`} />
                              </a>
                              <div className="flex-grow-1 d-flex justify-content-between align-items-center">
                                <div>
                                  <p className="text-bold text-sm m-0">{feedback.reviewerName}</p>
                                  <p className="text-xs mt-1 m-0">{feedback.review}</p>
                                  <p className="text-xs mt-1 m-0">{[1, 2, 3, 4, 5].map((value) => (
                                    <strong key={value} className='me-1'>{value <= feedback?.starCount ? <Star color={"#ffbb00"} size={"10"} /> : <Star size={"10"} />}</strong>
                                  ))}</p>
                                </div>
                                <p className="text-xs m-0 text-black-50">{feedback.date}</p>
                              </div>
                            </li>
                          )
                        })}
                      </div>
                    )}
                  </Reveal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
      <div className='booking-div position-fixed start-0 card card-body blur' style={{ bottom: isBookingOpen ? 0 : '-85%', height: isBookingOpen ? '85%' : '0px', zIndex: 9999, transition: 'bottom 0.3s ease, height 0.3s ease', boxShadow: '0 -5px 15px rgba(0, 0, 0, 0.3)', overflowY: 'auto' }}>
        <div className="d-flex justify-content-end">
          <p className='mx-1 cursor-pointer' onClick={() => setIsBookingOpen(false)}><CloseX_mark /></p>
        </div>
        <BookingConfirmModalDetails setIsBookingOpen={setIsBookingOpen} technicianDetails={technicianDetails} selectedDate={selectedDate} setSelectedDate={setSelectedDate} setBookingSuccess={setBookingSuccess} />
      </div>
    </>
  );
};

export default TechnicianProfileDetails;