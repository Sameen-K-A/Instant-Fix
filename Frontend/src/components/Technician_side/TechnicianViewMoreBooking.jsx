import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TechnicianNavbar from './NavbarPage';
import backgroundImage from "../../../public/images/HeaderBanner_2.png";
import confirmAlert from '../Common/SweetAlert/confirmAlert';
import { toast } from 'sonner';
import userAxiosInstance from '../../config/AxiosInstance/userInstance';

const TechnicianViewMoreBooking = () => {

  const [bookingDetails, setBookingDetails] = useState(null);
  const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  const location = useLocation();

  useEffect(() => {
    const booking_id = location.state?.booking_id;
    if (booking_id) {
      (async () => {
        try {
          const response = await userAxiosInstance.get("/technician/fetchingIndividualBookingDetails", {
            params: {
              booking_id: booking_id,
            },
          });
          setBookingDetails(response.data);
        } catch (error) {
          if (error.response.status === 401) {
            navigate("/login", { state: { message: "Authorization failed, please login" } });
          } else {
            toast.error("Can't collect booking details. Please try again later.");
          }
        };
      })();
    };
  }, [location.state]);

  const accept_reject_cencel_booking = (input) => {
    const message = input === "Accept" ? "Accept new booking request?" : (input === "Reject" ? "Reject new booking request?" : "Cancel your booking request")
    confirmAlert(message)
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await userAxiosInstance.patch("/technician/acceptRejectCancelNewBooking", {
              newStatus: input,
              booking_id: bookingDetails.booking_id,
              technician_id: userDetails?.technicianDetails[0]?.user_id,
            });
            const afterChange = { ...bookingDetails, booking_status: input === "Accept" ? "Pending" : (input === "Reject" ? "Rejected" : "Cancelled") };
            setBookingDetails(afterChange);
            toast.success(`Booking updated sucessfully successfully.`);
          } catch (error) {
            if (error.response.status === 401) {
              navigate("/login", { state: { message: "Authorization failed, please login" } });
            } else if (error.response && error.response.status === 304) {
              toast.error("Booking status is not changed.");
            } else {
              toast.error("Something went wrong, please try again later.");
            };
          };
        };
      });
  };


  return (
    <>
      <TechnicianNavbar />
      <nav className="bg-transparent shadow-none position-absolute ps-5 mt-5 w-100 z-index-2">
        <h6 className="font-weight-bolder mb-0 ms-2">Booking History</h6>
        <p className="text-sm mt-0 ms-2">Technician/ Profile/ Booking history/ View more details</p>
      </nav>
      <div className="container-fluid">
        <div className="page-header min-height-200 border-radius-xl mt-4" style={{ backgroundImage: `url(${backgroundImage})` }}>
        </div>
        <div className="card card-body blur shadow-blur mx-4 mb-5 mt-n6 overflow-hidden">
          <div className="col-xl-12 col-lg-12 col-md-12 d-flex flex-column">
            {bookingDetails ? (
              <>
                <div className='d-flex justify-content-end gap-2 mt-3 me-3'>
                  {bookingDetails?.booking_status === "Requested" ? (
                    <>
                      <button className='btn bg-gradient-danger' onClick={() => accept_reject_cencel_booking("Reject")}>Reject</button>
                      <button className='btn bg-gradient-primary' onClick={() => accept_reject_cencel_booking("Accept")}>Accept</button>
                    </>
                  ) : (
                    bookingDetails?.booking_status === "Pending" && (
                      <button className='btn bg-gradient-danger' onClick={() => accept_reject_cencel_booking("Cancel")}>Cancel Booking</button>
                    )
                  )}
                </div>
                <div className="container-fluid">
                  <div className="d-flex justify-content-around row ">
                    <div className="col-lg-5 col-12 mb-lg-0 mb-4">
                      <h3 className="font-weight-bolder mb-4 mt-3 text-info text-gradient">{bookingDetails?.booking_status}</h3>
                      <div className="table-responsive pb-3 col-12">
                        <table className="table align-items-center mb-0">
                          <tbody>
                            <tr>
                              <td colSpan="2">
                                <p className='text-bolder text-sm'>⦿ <u>Client Details</u></p>
                              </td>
                            </tr>
                            <tr>
                              <td><p className="text-xs mb-0">Name</p></td>
                              <td><p className="text-xs font-weight-bold mb-0">{bookingDetails.userDetails?.name}</p></td>
                            </tr>
                            <tr>
                              <td><p className="text-xs mb-0">Email</p></td>
                              <td><p className="text-xs font-weight-bold mb-0">{bookingDetails.userDetails?.email}</p></td>
                            </tr>
                            <tr>
                              <td><p className="text-xs mb-0">Phone</p></td>
                              <td><p className="text-xs font-weight-bold mb-0">{bookingDetails.userDetails?.phone}</p></td>
                            </tr>
                            <tr>
                              <td><p className="text-xs mb-0">Service Location</p></td>
                              <td><p className="text-xs font-weight-bold mb-0">
                                {bookingDetails?.serviceLocation?.address} <br />
                                {bookingDetails?.serviceLocation?.state}, {bookingDetails?.serviceLocation?.pincode}, <br />
                                Phone number : {bookingDetails?.serviceLocation?.phone} <br />
                                Alternate number : {bookingDetails?.serviceLocation?.alternatePhone}</p></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-lg-5 col-12 mb-5 px-5 mt-5">
                      <div className="table-responsive pb-3 col-12">
                        <table className="table align-items-center mb-0 mt-3">
                          <tbody>
                            <tr>
                              <td colSpan="2">
                                <p className='text-bolder text-sm'>⦿ <u>Booking Details</u></p>
                              </td>
                            </tr>
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
                              <td><p className="text-xs mb-0">Service Cost</p></td>
                              <td><p className="text-xs font-weight-bold mb-0">{bookingDetails?.serviceCost}</p></td>
                            </tr>
                            <tr>
                              <td><p className="text-xs mb-0">Payment Status</p></td>
                              <td><p className="text-xs font-weight-bold mb-0">{bookingDetails?.Payment_Status}</p></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h6 className='mt-5'>No details found</h6>
                <p className='text-sm'>Please check your booking history page</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TechnicianViewMoreBooking;