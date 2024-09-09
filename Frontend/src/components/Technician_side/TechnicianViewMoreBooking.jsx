import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TechnicianNavbar from './NavbarPage';
import backgroundImage from "../../../public/images/HeaderBanner_2.png";
import confirmAlert from '../Common/SweetAlert/confirmAlert';
import { toast } from 'sonner';
import userAxiosInstance from '../../Config/AxiosInstance/userInstance'; 
import { useUserDetails } from '../../Contexts/UserDetailsContext'; 
import ServiceLocationMap from './MapPage';
import { CloseX_mark } from '../../../public/svgs/Icons';
import WorkCompletedModal from './WorkCompletedModal';
import AlertRedDot from '../Common/AlertRedDot';
import Reveal from "../../../public/Animation/Animated";
import { useUserAuthContext } from '../../Contexts/UserAuthContext';

const TechnicianViewMoreBooking = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isMapOn, setIsMapOn] = useState(false);
  const [currentLocationLatitude, setCurrentLocationLatitude] = useState(null);
  const [currentLocationLongitude, setCurrentLocationLongitude] = useState(null);
  const [destinationLatitude, setDestinationLatitude] = useState(null);
  const [destinationLongitude, setDestinationLongitude] = useState(null);
  const [workCompleted, setWorkCompleted] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const { userDetails } = useUserDetails();
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsLogged } = useUserAuthContext();
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const booking_id = location.state?.booking_id;
    if (booking_id) {
      (async () => {
        try {
          const response = await userAxiosInstance.get("/technician/fetchingIndividualBookingDetails", { params: { booking_id } });
          setBookingDetails(response.data);
          setDestinationLongitude(response.data.serviceLocation.location.coordinates[0])
          setDestinationLatitude(response.data.serviceLocation.location.coordinates[1])
        } catch (error) {
          if (error.response.status === 401) {
            setIsLogged(false);
            navigate("/login", { state: { message: "Authorization failed, please login" } });
          } else {
            toast.error("Can't collect booking details. Please try again later.");
          };
        };
      })();
    }
  }, [location.state]);

  const accept_reject_cancel_booking = (input) => {
    if (input === "Accept") {
      const currentDate = new Date();
      const serviceDate = new Date(bookingDetails.serviceDate);
      currentDate.setHours(0, 0, 0, 0);
      serviceDate.setHours(0, 0, 0, 0);
      if (currentDate > serviceDate) {
        toast.error("Time is expired. Can't accept this booking request.");
        return;
      };
    };

    const message = input === "Accept" ? "Accept new booking request?" : (input === "Reject" ? "Reject new booking request?" : "Cancel your booking request");
    confirmAlert(message)
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await userAxiosInstance.patch("/technician/acceptRejectCancelNewBooking", {
              newStatus: input,
              booking_id: bookingDetails.booking_id,
              technician_id: userDetails?.technicianDetails[0]?.user_id,
              serviceDate: bookingDetails.serviceDate,
            });
            const afterChange = { ...bookingDetails, booking_status: input === "Accept" ? "Pending" : (input === "Reject" ? "Rejected" : "Cancelled") };
            setBookingDetails(afterChange);
            toast.success(`Booking updated successfully.`);
          } catch (error) {
            if (error.response.status === 401) {
              setIsLogged(false);
              navigate("/login", { state: { message: "Authorization failed, please login" } });
            } else if (error.response && error.response.status === 301) {
              toast.error("Booking status is not changed.");
            } else {
              toast.error("Something went wrong, please try again later.");
            }
          }
        }
      });
  };

  const handleFindDirection = () => {
    setMapLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocationLatitude(latitude);
          setCurrentLocationLongitude(longitude);
          setIsMapOn(true);
          setMapLoading(false);
          setTimeout(() => {
            mapContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        },
        (error) => {
          setMapLoading(false);
          toast.error("Oops! Direction is not available.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      setMapLoading(false);
      toast.error("Oops! Direction is not available.");
    };
  };

  return (
    <>
      <TechnicianNavbar />
      {workCompleted && <div className="modal-backdrop" onClick={() => setWorkCompleted(false)} />}
      <nav className="bg-transparent shadow-none position-absolute ps-5 mt-5 w-100 z-index-2">
        <h6 className="font-weight-bolder mb-0 ms-2">Booking History</h6>
        <p className="text-sm mt-0 ms-2">Technician/ Profile/ Booking history/ View more details</p>
      </nav>
      <div className="container-fluid">
        <div className="page-header min-height-200 border-radius-xl mt-4" style={{ backgroundImage: `url(${backgroundImage})` }}>
        </div>
        <div className="card card-body blur-sm shadow-blur mx-4 mb-5 mt-n6 overflow-hidden">
          <div className="col-xl-12 col-lg-12 col-md-12 d-flex flex-column">
            {bookingDetails ? (
              <Reveal>
                <div className='d-flex justify-content-end gap-2 mt-3 me-3'>
                  {bookingDetails?.booking_status === "Requested" ? (
                    <>
                      <button className='btn bg-gradient-danger' onClick={() => accept_reject_cancel_booking("Reject")}>Reject</button>
                      <button className='btn bg-gradient-primary' onClick={() => accept_reject_cancel_booking("Accept")}>Accept</button>
                    </>
                  ) : (
                    bookingDetails?.booking_status === "Pending" && (
                      <>
                        <button className='btn bg-gradient-danger' onClick={() => accept_reject_cancel_booking("Cancel")}>Cancel Booking</button>
                        <button className='btn bg-gradient-primary' onClick={() => setWorkCompleted(true)}>Complete</button>
                      </>
                    )
                  )}
                  {(bookingDetails?.booking_status !== "Cancelled" || bookingDetails?.booking_status !== "Rejected") && (
                    mapLoading ? (
                      <button className='btn bg-gradient-success text-white'>Loading . . .</button>
                    ) : (
                      <button className='btn bg-gradient-success text-white' onClick={handleFindDirection}>Find Direction</button>
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
                              <td><p className="text-xs font-weight-bold mb-0">{bookingDetails?.booking_profession}</p></td>
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
                              <td><p className="text-xs mb-0">Service Cost</p></td>
                              <td><p className="text-xs font-weight-bold mb-0">{bookingDetails?.serviceCost}</p></td>
                            </tr>
                            <tr>
                              <td><p className="text-xs mb-0">Payment Status</p></td>
                              <td><p className="text-xs font-weight-bold mb-0 d-flex">{bookingDetails?.payment_status}<span className='ms-1'>{bookingDetails?.payment_status === "Requested" && <AlertRedDot />}</span></p></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  {isMapOn && (currentLocationLatitude && currentLocationLongitude && destinationLatitude && destinationLongitude) && (
                    console.log("ksjdnvkjsdbfvujsdhfbvjhdfsb"),
                    <div ref={mapContainerRef} style={{ height: '500px', width: '100%', borderRadius: "20%" }} className='mb-10'>
                      <ServiceLocationMap
                        currentLocation={{ latitude: currentLocationLatitude, longitude: currentLocationLongitude }}
                        destination={{ longitude: destinationLongitude, latitude: destinationLatitude }}
                      />
                    </div>
                  )}
                </div>
              </Reveal>
            ) : (
              <p className="text-center">Loading booking details...</p>
            )}
          </div>
        </div>
      </div>
      {bookingDetails !== null && (
        <div className='booking-div position-fixed start-0 card card-body blur col-12' style={{ bottom: workCompleted ? 0 : '-25%', height: workCompleted ? '25%' : '0px', zIndex: 9999, transition: 'bottom 0.3s ease, height 0.3s ease', boxShadow: '0 -5px 15px rgba(0, 0, 0, 0.3)', overflowY: 'auto' }}>
          <div className="d-flex justify-content-end">
            <p className='mx-1 cursor-pointer' onClick={() => setWorkCompleted(false)}><CloseX_mark /></p>
          </div>
          <WorkCompletedModal setWorkCompleted={setWorkCompleted} bookingDetails={bookingDetails} setBookingDetails={setBookingDetails} />
        </div>
      )}
    </>
  );
};

export default TechnicianViewMoreBooking;