import React, { useEffect, useState } from 'react';
import BackgroundShape from '../Common/backgroundShape';
import { useLocation } from 'react-router-dom';
import TechnicianNavbar from './NavbarPage';

const TechnicianViewMoreBooking = () => {

  const [bookingDetails, setBookingDetails] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setBookingDetails(location.state?.bookingDetails || null);
  }, [location.state]);

  return (
    <>
      <TechnicianNavbar />
      <div className="page-header min-vh-75">
        <div className="container">
          <div className="row">
            {bookingDetails ? (
              <div className="col-xl-8 col-lg-9 col-md-10 col-12 d-flex flex-column" style={{ zIndex: 1 }}>
                <div className="card card-plain mt-8">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-lg-12 mb-lg-0 mb-4">
                        <h3 className="font-weight-bolder mt-3 mb-4 text-info text-gradient">{bookingDetails.booking_status}</h3>
                        <div className="row">
                          <div className="col-lg-6 col-12">
                            <div className="table-responsive pb-3">
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
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="col-lg-6 col-12">
                            <div className="table-responsive pb-3">
                              <table className="table align-items-center mb-0">
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
                                    <td><p className="text-xs mb-0">Booking status</p></td>
                                    <td><p className="text-xs font-weight-bold mb-0">{bookingDetails?.booking_status}</p></td>
                                  </tr>
                                  <tr>
                                    <td><p className="text-xs mb-0">Service Date</p></td>
                                    <td><p className="text-xs font-weight-bold mb-0">{bookingDetails?.serviceDate}</p></td>
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h6 className='mt-5'>No details found</h6>
                <p className='text-sm'>Please check your booking history page</p>
              </>
            )}
          </div>
          <BackgroundShape />
        </div>
      </div>
    </>
  );
};

export default TechnicianViewMoreBooking;