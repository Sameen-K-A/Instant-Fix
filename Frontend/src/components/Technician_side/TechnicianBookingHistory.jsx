import { useEffect, useState } from "react";
import TechnicianNavbar from "./NavbarPage";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../../public/images/HeaderBanner_2.png";
import userAxiosInstance from "../../config/AxiosInstance/userInstance";
import { useUserDetails } from "../../Contexts/UserDetailsContext";
import { toast } from "sonner";
import { io } from 'socket.io-client';
import { Base_URL } from '../../config/credentials';

const socket = io(Base_URL);

const TechnicianBookingHistoryTable = () => {

  const [bookingDetailsArray, setBookingDetailsArray] = useState([]);
  const { userDetails } = useUserDetails();
  const navigate = useNavigate();

  const fetchBookingDetails = async () => {
    try {
      const response = await userAxiosInstance.get("/technician/fetchTechnicianBookingHistory", { params: { technicianUserID: userDetails?.user_id } });
      setBookingDetailsArray(response.data);
    } catch (error) {
      if (error.response.status === 401) {
        navigate("/login", { state: { message: "Authorization failed, please login" } });
      } else {
        toast.error("Can't fetch booking history, Please try again later");
      }
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  useEffect(() => {
    if (userDetails) {
      socket.emit("joinTechnicianNoficationRoom", userDetails?.user_id);
      socket.on("notification_to_technician", () => {
        fetchBookingDetails();
      });
      return () => {
        socket.off("notification_to_technician");
      };
    };
  }, [userDetails]);

  const goToViewMore = (bookingDetails) => {
    navigate("/technician/technicianBookingViewmore", { state: { booking_id: bookingDetails.booking_id } });
  };

  return (
    <>
      <TechnicianNavbar />
      <nav className="bg-transparent shadow-none position-absolute ps-5 mt-5 w-100 z-index-2">
        <h6 className="font-weight-bolder mb-0 ms-2">Booking History</h6>
        <p className="text-sm mt-0 ms-2">Technician/ Profile/ Booking history</p>
      </nav>
      <div className="container-fluid">
        <div className="page-header min-height-200 border-radius-xl mt-4" style={{ backgroundImage: `url(${backgroundImage})` }}>
        </div>
        <div className="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
          <div className="col-xl-12 col-lg-12 col-md-12 d-flex flex-column" style={{ zIndex: "1" }}>
            <div className="container-fluid">
              {bookingDetailsArray.length !== 0 ? (
                <>
                  <div className="card-header pb-0 mb-3 mt-3">
                    <h5 className="text-center mb-3">Booking History</h5>
                  </div>
                  <div className="card-body px-0 pt-0 pb-2">
                    <div className="table-responsive p-0 pb-3">
                      <table className="table align-items-center mb-0">
                        <thead>
                          <tr>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">SL</th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Client Name</th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Booking Date</th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Booking Time</th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">More Details</th>
                          </tr>
                        </thead>
                        <tbody className="text-center">
                          {bookingDetailsArray.map((data, index) => {
                            return (
                              <tr key={data?.booking_id}>
                                <td className="text-xs text-bold"><p className="text-xs font-weight-bold mb-0"></p>{index + 1 < 10 ? `0${index + 1}` : index + 1}</td>
                                <td><p className="text-xs font-weight-bold mb-0">{data?.userDetails?.name}</p></td>
                                <td><p className="text-xs font-weight-bold mb-0">{data?.bookingDate}</p></td>
                                <td><p className="text-xs font-weight-bold mb-0">{data?.bookingTime}</p></td>
                                <td className="text-sm">
                                  <span
                                    className={`badge badge-sm 
                                      ${(data?.booking_status === "Rejected" || data?.booking_status === "Cancelled") ? "bg-gradient-faded-danger" :
                                        (data?.booking_status === "Requested" || data?.booking_status === "Pending") ? "bg-gradient-faded-warning" :
                                          data?.booking_status === "Completed" ? "bg-success" : ""}`}
                                  >
                                    {data?.booking_status}
                                  </span>
                                </td>
                                <td><button className="btn bg-gradient-primary mb-0 text-center" onClick={() => goToViewMore(data)}>View more</button></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h5 className="mt-7 text-dark">No details found</h5>
                  <p>Please stay available to receive new bookings from clients.</p>
                  <p className="text-sm text-black-50 mb-2">To change your availability, follow these steps:</p>
                  <ol className="text-sm text-black-50 mb-7">
                    <li>Tap on your profile in the top right corner.</li>
                    <li>Click on "Account Details."</li>
                    <li>Change your availability.</li>
                  </ol>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TechnicianBookingHistoryTable;