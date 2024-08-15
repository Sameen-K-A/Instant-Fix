import { useEffect, useState } from "react";
import BackgroundShape from "../Common/backgroundShape";
import UserNavbar from "./NavbarPage";
import userAxiosInstance from "../../config/AxiosInstance/userInstance";
import { toast } from "sonner";
import { Base_URL } from "../../config/credentials";
import { useNavigate } from "react-router-dom";

const UserBookingHistoryTable = () => {

  const [bookingDetailsArray, setBookingDetailsArray] = useState([]);
  const navigate = useNavigate();
  const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  useEffect(() => {
    (async () => {
      try {
        const response = await userAxiosInstance.get(`${Base_URL}/fetchUserBookingHistory`, { params: { user_id: userDetails.user_id } });
        setBookingDetailsArray(response.data);
      } catch (error) {
        toast.error("Can't find booking history, please wait for a moment.");
      }
    })();
  }, []);

  const handleViewmore = (bookingDetails) => {
    navigate("/viewmoreHistory", { state: { bookingDetails: bookingDetails } });
  };

  return (
    <>
      <UserNavbar />
      <div className="page-header min-vh-75">
        <div className="container">
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 d-flex flex-column" style={{ zIndex: "1" }}>
              <div className="container-fluid">
                {bookingDetailsArray.length !== 0 ? (
                  <div className="card mb-4 mt-7">
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
                                  <td className=" text-sm"><span className="badge badge-sm bg-gradient-faded-warning">{data?.booking_status}</span></td>
                                  <td><button className="btn bg-gradient-primary mb-0 text-center" onClick={() => handleViewmore(data)}>View more</button></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h5 className="mt-7 text-dark">No details recorded</h5>
                    <p>Find the technicians you want based on your nearest location.</p>
                    <ol className="text-sm text-black-50">
                      <li>Click right top 'Technicians' button</li>
                      <li>Find technicians based on your desired category.</li>
                    </ol>
                  </>
                )}
              </div>
            </div>
            <BackgroundShape />
          </div>
        </div>
      </div>
    </>
  );
}

export default UserBookingHistoryTable;