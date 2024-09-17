import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserNavbar from './NavbarPage';
import userAxiosInstance from '../../Config/AxiosInstance/userInstance'; 
import confirmAlert from '../Common/SweetAlert/confirmAlert';
import { toast } from "sonner";
import { loadRazorpayScript, proceedToPayment } from '../../Utils/razorPay';
import AlertRedDot from '../Common/AlertRedDot';
import backgroundImage from "../../../public/images/HeaderBanner_2.png";
import { Base_URL, razorpayURL } from "../../config/credentials";
import Reveal from '../../../public/Animation/Animated';
import RatingStar from "../Common/StarRating";
import { useUserDetails } from '../../Contexts/UserDetailsContext';
import { useUserAuthContext } from '../../Contexts/UserAuthContext';

const UserHistoryViewMore = () => {
  const [bookingDetails, setBookingDetails] = useState({});
  const { userDetails } = useUserDetails();
  const location = useLocation();
  const navigate = useNavigate();
  const [rating, setRating] = useState(3);
  const [enteredFeedback, setEnteredFeedback] = useState("");
  const { setIsLogged } = useUserAuthContext();

  useEffect(() => {
    const fetchBookingDetails = async (booking_id) => {
      try {
        const response = await userAxiosInstance.get("/fetchIndividualBookingInformation", {
          params: { booking_id },
        });
        setBookingDetails(response.data);
      } catch (error) {
        handleError(error);
      }
    };
    const booking_id = location.state?.booking_id;
    if (booking_id) fetchBookingDetails(booking_id);
  }, [location.state?.booking_id]);

  useEffect(() => {
    loadRazorpayScript();
    return () => {
      const script = document.querySelector(`script[src="${razorpayURL}"]`);
      if (script) document.body.removeChild(script);
    };
  }, []);

  const handleCancelBooking = () => {
    confirmAlert("Do you want to cancel your booking request?")
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const userDetails = JSON.parse(localStorage.getItem("userDetails"));
            await userAxiosInstance.patch("/cancelBooking", {
              booking_id: bookingDetails.booking_id,
              technician_id: bookingDetails.technicianUser_id,
              userName: userDetails.name,
              serviceDate: bookingDetails.serviceDate,
            });
            setBookingDetails({ ...bookingDetails, booking_status: "Cancelled" });
            toast.success("Booking cancelled successfully");
          } catch (error) {
            handleError(error);
          }
        }
      });
  };

  const handleError = (error) => {
    if (error.response.status === 401) {
      setIsLogged(false);
      navigate("/login", { state: { message: "Authorization failed, please login" } });
    } else {
      toast.error("Something went wrong, please try again later.");
    }
  };

  const submitSendReview = async () => {
    if (enteredFeedback.trim() !== "") {
      try {
        await userAxiosInstance.post("/submitReview", {
          user_id: userDetails.user_id,
          technicianUser_id: bookingDetails.technicianDetails.user_id,
          enteredRating: rating,
          enteredFeedback: enteredFeedback,
          booking_id: bookingDetails.booking_id
        });
        const afterFeedback = { ...bookingDetails, reviewAdded: true };
        setBookingDetails(afterFeedback);
        toast.success("Thank you for your feedback. Have a good day.");
      } catch (error) {
        if (error.response.status === 401) {
          setIsLogged(false);
          navigate("/login", { state: { message: "Authorization failed please login" } });
        } else {
          toast.error("Something wrong. Please try again later");
        };
      };
    } else {
      toast.error("Enter your feedback");
    };
  };

  return (
    <>
      <UserNavbar />
      <nav className="bg-transparent shadow-none position-absolute ps-5 mt-5 w-100 z-index-2">
        <h6 className="font-weight-bolder mb-0 ms-2">Booking History</h6>
        <p className="text-sm mt-0 ms-2">Profile/ Booking history/ View more details</p>
      </nav>
      <div className="container-fluid pe-6">
        <div className="page-header min-height-200 border-radius-xl mt-4" style={{ backgroundImage: `url(${backgroundImage})` }} />
        <div className="card card-body blur-sm shadow-blur mx-4 mb-5 mt-n6 overflow-hidden">
          <Reveal>
            <div className="col-xl-12 col-lg-12 col-md-12 d-flex flex-column">
              {bookingDetails?.booking_id ? (
                <div className={`container-fluid ${bookingDetails?.payment_status !== "Requested" && "mt-5"}`}>
                  {bookingDetails?.payment_status === "Requested" && (
                    <div className="d-flex justify-content-end gap-2 mt-3 me-3">
                      <div className="ms-2 d-flex flex-column justify-content-end">
                        <button
                          className="btn bg-gradient-primary"
                          onClick={() =>
                            proceedToPayment(bookingDetails.booking_id, bookingDetails.serviceCost, bookingDetails.technicianUser_id, setBookingDetails)}
                        >Proceed to payment, &emsp; ₹ {bookingDetails.serviceCost}.00</button><span className="text-xs text-danger d-flex gap-2 align-items-center text-bold"><AlertRedDot />Your work is completed. Please complete your payment.</span>
                      </div>
                    </div>
                  )}
                  <div className="d-flex justify-content-around">
                    <div className="col-lg-5 mb-lg-0 mb-4">
                      <h3 className="font-weight-bolder mb-4 text-info text-gradient">
                        {bookingDetails?.booking_status}
                      </h3>
                      <div className="table-responsive pb-3 col-12">
                        <table className="table align-items-center mb-0">
                          <tbody>
                            {[
                              { label: "Booking ID", value: bookingDetails?.booking_id },
                              { label: "Service type", value: bookingDetails?.booking_profession },
                              { label: "Booking Date", value: bookingDetails?.bookingDate },
                              { label: "Booking Time", value: bookingDetails?.bookingTime },
                              { label: "Booking status", value: bookingDetails?.booking_status },
                              { label: "Service Date", value: bookingDetails?.serviceDate },
                              { label: "Service completed date", value: bookingDetails?.serviceCompletedDate },
                              {
                                label: "Service Location",
                                value: (
                                  <>
                                    {bookingDetails?.serviceLocation?.address} <br />
                                    {bookingDetails?.serviceLocation?.state},{" "}
                                    {bookingDetails?.serviceLocation?.pincode}, <br />
                                    Phone number: {bookingDetails?.serviceLocation?.phone} <br />
                                    Alternate number: {bookingDetails?.serviceLocation?.alternatePhone}
                                  </>
                                ),
                              },
                              { label: "Service Cost", value: bookingDetails?.serviceCost },
                              { label: "Payment Status", value: bookingDetails?.payment_status },
                            ].map((row, index) => (
                              <tr key={index}>
                                <td><p className="text-xs mb-0">{row.label}</p></td>
                                <td><p className="text-xs font-weight-bold mb-0">{row.value}</p></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {bookingDetails?.booking_status === "Requested" && (
                          <div className="ms-2 mt-3">
                            <span className="text-xs text-danger d-flex gap-2 align-items-center"><AlertRedDot />Booking cancellation is available until the technician accepts your booking request.</span>
                            <button className="btn bg-gradient-danger mt-2" onClick={handleCancelBooking}>Cancel Booking</button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-4 mb-5 px-5 mt-5 d-flex flex-column justify-content-center">
                      {(bookingDetails?.booking_status === "Completed" && bookingDetails.reviewAdded === false) ? (
                        <>
                          <div className="row mt-5">
                            <div className="col-auto">
                              <div className="avatar avatar-xl position-relative">
                                <img src={`${bookingDetails.technicianDetails.profileIMG}`} alt="profile_image" className="w-100 h-100 border-radius-lg shadow-sm" />
                              </div>
                            </div>
                            <div className="col-auto my-auto">
                              <div className="h-100">
                                <h5 className="mb-1 text-dark">{bookingDetails.technicianDetails.name}</h5>
                                <p className="mb-0 text-sm">{bookingDetails.technicianDetails.email}</p>
                              </div>
                            </div>
                          </div>
                          <hr className='horizontal dark' />
                          <div>
                            <p className="text-bold text-sm text-black-65 m-0">Your rating</p>
                            <RatingStar rating={rating} setRating={setRating} />
                            <textarea className='form-control min-height-100 max-height-100' placeholder='Enter your feedback about the technician' onChange={(e) => setEnteredFeedback(e.target.value)}></textarea>
                            <button className='btn bg-gradient-primary mt-3 w-100' onClick={() => submitSendReview()}>Submit</button>
                          </div>
                        </>
                      ) : (
                        <div className="row">
                          <div className="col-auto">
                            <div className="avatar avatar-xxl position-relative">
                              <img src={`${bookingDetails.technicianDetails.profileIMG}`} alt="profile_image" className="w-100 h-100 border-radius-lg shadow-sm" />
                            </div>
                          </div>
                          <div className="col-auto my-auto">
                            <div className="h-100">
                              <h5 className="mb-1 text-primary">{bookingDetails.technicianDetails.name}</h5>
                              <p className="mb-0 text-sm">{bookingDetails.technicianDetails.email}</p>
                              <button className='btn btn-outline-primary mt-3' onClick={() => navigate("/techniciandetails", {state: {details: bookingDetails.technicianDetails}})}>Check Profile</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h6 className="mt-5">No details found</h6>
                  <p className="text-sm mb-5">Please check your booking history page</p>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
};

export default UserHistoryViewMore;