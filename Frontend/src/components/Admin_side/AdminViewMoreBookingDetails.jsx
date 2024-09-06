import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import backgroundImage from "../../../public/images/HeaderBanner_2.png";
import AdminNavbar from './AdminNavbar';
import { Base_URL } from '../../config/credentials';
import Reveal from "../../../public/Animation/Animated";

const AdminViewMoreBookingDetails = () => {

  const [bookingDetails, setBookingDetails] = useState({});
  const location = useLocation();
  useEffect(() => {
    setBookingDetails(location.state?.bookingDetails);
  }, [location.state])

  return (
    <>
      <AdminNavbar />
      <nav className="bg-transparent shadow-none position-absolute ps-5 mt-5 w-100 z-index-2">
        <h6 className=" font-weight-bolder mb-0 ms-2">Booking details</h6>
        <p className="text-sm mt-0 ms-2">Admin/ Bookings list/ Booking details</p>
      </nav>
      <div className="container-fluid">
        <div className="page-header min-height-200 border-radius-xl mt-4" style={{ backgroundImage: `url(${backgroundImage})` }}>
        </div>
        <div className="card card-body blur-sm shadow-blur mx-4 mb-5 mt-n6 overflow-hidden">
          <div className="col-xl-12 col-lg-12 col-md-12 d-flex flex-column">
            {bookingDetails?.booking_id ? (
              <Reveal>
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
                      </div>
                    </div>
                    <div className="col-lg-5 mt-5 d-flex flex-column gap-3">
                      <div className="card card-plain">
                        <h6 className="mb-3 text-dark">Client Information</h6>
                        <div className=" d-flex gap-3 align-items-center">
                          <img src={`${Base_URL}/${bookingDetails?.userDetails?.profileIMG}`} width="100" className="mb-3" alt="Client Profile" />
                          <div>
                            <p className="text-sm mb-2"><span className="text-black-50">Name: </span><b>{bookingDetails?.userDetails?.name}</b></p>
                            <p className="text-sm mb-2"><span className="text-black-50">Email: </span><b>{bookingDetails?.userDetails?.email}</b></p>
                            <p className="text-sm mb-2"><span className="text-black-50">Contact: </span><b>{bookingDetails?.userDetails?.phone}</b></p>
                          </div>
                        </div>
                      </div>
                      <hr className="horizontal dark my-4" />
                      <div className="card card-plain align-self-start">
                        <h6 className="mb-3 text-dark">Technician Information</h6>
                        <div className="d-flex gap-3 align-items-center">
                          <img src={`${Base_URL}/${bookingDetails?.technicianDetails?.profileIMG}`} width="100" className="mb-3" alt="Technician Profile" />
                          <div>
                            <p className="text-sm mb-2"><span className="text-black-50">Name: </span><b>{bookingDetails?.technicianDetails?.name}</b></p>
                            <p className="text-sm mb-2"><span className="text-black-50">Email: </span><b>{bookingDetails?.technicianDetails?.email}</b></p>
                            <p className="text-sm mb-2"><span className="text-black-50">Contact: </span><b>{bookingDetails?.technicianDetails?.phone}</b></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
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

export default AdminViewMoreBookingDetails;