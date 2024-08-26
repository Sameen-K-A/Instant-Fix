import React, { useEffect, useState } from 'react';
import UserNavbar from './NavbarPage';
import { useLocation } from 'react-router-dom';
import userAxiosInstance from "../../config/AxiosInstance/userInstance";
import backgroundImage from "../../../public/images/HeaderBanner_2.png";
import confirmAlert from '../Common/SweetAlert/confirmAlert';
import { toast } from "sonner";
import AlertRedDot from '../Common/AlertRedDot';

const UserHistoryViewMore = () => {

  const [bookingDetails, setBookingDetails] = useState({});
  const location = useLocation();
  useEffect(() => {
    const booking_id = location.state?.booking_id
    if (booking_id) {
      (async () => {
        try {
          const response = await userAxiosInstance.get("/fetchIndividualBookingInformation", { params: { booking_id: booking_id } });
          setBookingDetails(response.data);
        } catch (error) {
          if (error.response.status === 401) {
            navigate("/login", { state: { message: "Authorization failed, please login" } });
          } else {
            toast.error("Something wrong please try again later.")
          }
        }
      })();
    };
  }, []);

  const handleCancelBooking = () => {
    confirmAlert("Do you want to cancel your booking request.")
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
            await userAxiosInstance.patch("/cancelBooking", {
              booking_id: bookingDetails.booking_id, technician_id: bookingDetails.technicianUser_id, userName: userDetails.name, serviceDate: bookingDetails.serviceDate
            });
            const afterCancelling = { ...bookingDetails, booking_status: "Cancelled" };
            setBookingDetails(afterCancelling);
            toast.success("Booking cancelled successfully");
          } catch (error) {
            if (error.response.status === 401) {
              navigate("/login", { state: { message: "Authorization failed, please login" } });
            } else if (error.response && error.response.status === 304) {
              toast.error("Can't cancel booking request, please try again later");
            } else {
              toast.error("Something wrong. please try again later");
            };
          };
        };
      });
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
        <div className="card card-body blur shadow-blur mx-4 mb-5 mt-n6 overflow-hidden">
          <div className="col-xl-12 col-lg-12 col-md-12 d-flex flex-column">
            {bookingDetails?.booking_id ? (
              <div className="container-fluid mt-6">
                <div className="d-flex justify-content-around">
                  <div className="col-lg-5 mb-lg-0 mb-4">
                    <h3 className="font-weight-bolder mb-4 text-info text-gradient">{bookingDetails?.booking_status}</h3>
                    <div className="table-responsive pb-3 col-12">
                      <table className="table align-items-center mb-0">
                        <tbody>
                          <tr>
                            <td><p className="text-xs mb-0">Booking ID</p></td>
                            <td><p className="text-xs font-weight-bold mb-0">{bookingDetails?.booking_id}</p></td>
                          </tr>
                          <tr>
                            <td><p className="text-xs mb-0">Service type</p></td>
                            <td><p className="text-xs font-weight-bold mb-0">{bookingDetails?.Booking_profession}</p></td>
                          </tr>
                          <tr>
                            <td><p className="text-xs mb-0">Booking Date</p></td>
                            <td><p className="text-xs font-weight-bold mb-0">{bookingDetails?.bookingDate}</p></td>
                          </tr>
                          <tr>
                            <td><p className="text-xs mb-0">Booking Time</p></td>
                            <td><p className="text-xs font-weight-bold mb-0">{bookingDetails?.bookingTime}</p></td>
                          </tr>
                          <tr>
                            <td><p className="text-xs mb-0">Booking status</p></td>
                            <td><p className="text-xs font-weight-bold mb-0">{bookingDetails?.booking_status}</p></td>
                          </tr>
                          <tr>
                            <td><p className="text-xs mb-0">Service Date</p></td>
                            <td><p className="text-xs font-weight-bold mb-0">{bookingDetails?.serviceDate}</p></td>
                          </tr>
                          <tr>
                            <td><p className="text-xs mb-0">Service completed date</p></td>
                            <td><p className="text-xs font-weight-bold mb-0">{bookingDetails?.serviceCompletedDate}</p></td>
                          </tr>
                          <tr>
                            <td><p className="text-xs mb-0">Service Location</p></td>
                            <td><p className="text-xs font-weight-bold mb-0">
                              {bookingDetails?.serviceLocation?.address} <br />
                              {bookingDetails?.serviceLocation?.state}, {bookingDetails?.serviceLocation?.pincode}, <br />
                              Phone number : {bookingDetails?.serviceLocation?.phone} <br />
                              Alternate number : {bookingDetails?.serviceLocation?.alternatePhone}</p></td>
                          </tr>
                          <tr>
                            <td><p className="text-xs mb-0">Service Cost</p></td>
                            <td><p className="text-xs font-weight-bold mb-0">{bookingDetails?.serviceCost}</p></td>
                          </tr>
                          <tr>
                            <td><p className="text-xs mb-0">Payment Status</p></td>
                            <td><p className="text-xs font-weight-bold mb-0">{bookingDetails?.Payment_Status}</p></td>
                          </tr>
                        </tbody>
                      </table>
                      {bookingDetails?.booking_status === "Requested" && (
                        <div className='ms-2 mt-3'>
                          <span className='text-xs text-danger d-flex gap-2 align-items-center'><AlertRedDot />Booking cancellation is available until the technician accepts your booking request.</span>
                          <button className="btn bg-gradient-danger mt-2" onClick={() => handleCancelBooking()}>Cancel Booking</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-4 mb-5 px-5 mt-5 d-flex flex-column justify-content-center">


                  </div>
                </div>
              </div>
            ) : (
              <>
                <h6 className='mt-5'>No details found</h6>
                <p className='text-sm mb-5'>Please check your booking history page</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
};

export default UserHistoryViewMore;