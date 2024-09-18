import { useEffect, useState } from "react";
import UserNavbar from "./NavbarPage";
import userAxiosInstance from "../../Config/userInstance"; 
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../../public/images/HeaderBanner_2.png";
import { useUserDetails } from "../../Contexts/UserDetailsContext";
import AlertRedDot from "../Common/AlertRedDot"; 
import Reveal from "../../../public/Animation/Animated";
import { useUserAuthContext } from "../../Contexts/UserAuthContext";

const UserBookingHistoryTable = () => {
  
  const [bookingDetailsArray, setBookingDetailsArray] = useState([]);
  const { userDetails } = useUserDetails();
  const navigate = useNavigate();
  const { setIsLogged } = useUserAuthContext();

  useEffect(() => {
    (async () => {
      try {
        const response = await userAxiosInstance.get(`${import.meta.env.VITE_BASE_URL}/fetchUserBookingHistory`, { params: { user_id: userDetails.user_id } });
        setBookingDetailsArray(response.data);
      } catch (error) {
        if (error.response.status === 401) {
          setIsLogged(false);
          navigate("/login", { state: { message: "Authorization failed, please login" } });
        } else {
          toast.error("Can't find booking history, please wait for a moment.");
        }
      }
    })();
  }, []);

  const handleViewmore = (bookingDetails) => {
    navigate("/viewmoreHistory", { state: { booking_id: bookingDetails?.booking_id } });
  };

  return (
    <>
      <UserNavbar />
      <nav className="bg-transparent shadow-none position-absolute ps-5 mt-5 w-100 z-index-2">
        <h6 className="font-weight-bolder mb-0 ms-2">Booking History</h6>
        <p className="text-sm mt-0 ms-2">Profile/ Booking history</p>
      </nav>
      <div className="container-fluid pe-6">
        <div className="page-header min-height-200 border-radius-xl mt-4" style={{ backgroundImage: `url(${backgroundImage})` }} />
        <div className="card card-body blur-sm shadow-blur mx-4 mt-n6 overflow-hidden">
          <div className="col-xl-12 col-lg-12 col-md-12 d-flex flex-column" style={{ zIndex: "1" }}>
            <div className="container-fluid">
              {bookingDetailsArray.length !== 0 ? (
                <Reveal>
                  <div className="card-header pb-0 mb-3 mt-3">
                    <h5 className="text-center mb-3">Booking History</h5>
                  </div>
                  <div className="card-body px-0 pt-0 pb-2">
                    <div className="table-responsive p-0 pb-3">
                      <table className="table align-items-center mb-0">
                        <thead>
                          <tr>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">SL</th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Technician Name</th>
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
                                <td><p className="text-xs font-weight-bold mb-0">{data?.technicianPersonal?.name}</p></td>
                                <td><p className="text-xs font-weight-bold mb-0">{data?.bookingDate}</p></td>
                                <td><p className="text-xs font-weight-bold mb-0">{data?.bookingTime}</p></td>
                                <td className="text-sm">
                                  <span
                                    className={`badge badge-sm 
                                      ${(data?.booking_status === "Rejected" || data?.booking_status === "Cancelled") && "bg-gradient-faded-danger"}  
                                      ${(data?.booking_status === "Requested" || data?.booking_status === "Pending") && "bg-gradient-faded-warning"} 
                                      ${data?.booking_status === "Completed" && "bg-success"}`}
                                  >{data?.booking_status}
                                  </span>
                                </td>
                                <td className="d-flex justify-content-center"><button className="btn bg-gradient-primary mb-0 text-center" onClick={() => handleViewmore(data)}>View more</button>{data.payment_status === "Requested" && <AlertRedDot />}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Reveal>
              ) : (
                <>
                  <h5 className="mt-7 text-dark">No details recorded</h5>
                  <p>Find the technicians you want based on your nearest location.</p>
                  <ol className="text-sm text-black-50 mb-7">
                    <li>Click right top 'Technicians' button</li>
                    <li>Find technicians based on your desired category.</li>
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

export default UserBookingHistoryTable;