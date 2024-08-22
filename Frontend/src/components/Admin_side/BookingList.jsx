import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import adminAxiosInstance from "../../config/AxiosInstance/adminInstance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../../public/images/HeaderBanner_2.png";

const AdminBookingHistoryTable = () => {

  const [bookingDetailsArray, setBookingDetailsArray] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await adminAxiosInstance.get(`/fetchbookings`);
        setBookingDetailsArray(response.data);
      } catch (error) {
        if (error.response.status === 401) {
          navigate("/login", { state: { message: "Authorization failed, please login" } });
        } else {
          toast.error("Can't find booking history, please wait for a moment.");
        }
      }
    })();
  }, []);

  const handleViewmore = (bookingDetails) => {
    navigate("/admin/viewmoreBookingDetails", { state: { bookingDetails: bookingDetails } });
  };

  return (
    <>
      <AdminNavbar />
      <nav className="bg-transparent shadow-none position-absolute ps-5 mt-5 w-100 z-index-2">
        <h6 className=" font-weight-bolder mb-0 ms-2">Instant-Fix all bookings</h6>
        <p className="text-sm mt-0 ms-2">Admin/ Bookings list</p>
      </nav>
      <div className="container-fluid">
        <div className="page-header min-height-200 border-radius-xl mt-4" style={{ backgroundImage: `url(${backgroundImage})` }}>
        </div>
        <div className="card card-body blur shadow-blur mx-4 mb-5 mt-n6 overflow-hidden">
          <div className="col-xl-12 col-lg-12 col-md-12 d-flex flex-column">
            <div className="container-fluid">
              {bookingDetailsArray.length !== 0 ? (
                <>
                  <div className="card-header pb-0 mb-3 mt-3">
                    <h5 className="text-center mb-3">Booking History</h5>
                  </div>
                  <div className="card-body px-0 pt-0 pb-2">
                    <div className="table-responsive p-0 pb-3" style={{ maxHeight: "300px" }}>
                      <table className="table align-items-center mb-0">
                        <thead>
                          <tr>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">SL</th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Technician Name</th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Client Name</th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Booking Date</th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">More Details</th>
                          </tr>
                        </thead>
                        <tbody className="text-center">
                          {bookingDetailsArray.map((data, index) => {
                            return (
                              <tr key={data?.booking_id}>
                                <td className="text-xs text-bold"><p className="text-xs font-weight-bold mb-0"></p>{index + 1 < 10 ? `0${index + 1}` : index + 1}</td>
                                <td><p className="text-xs font-weight-bold mb-0">{data?.technicianDetails?.name}</p></td>
                                <td><p className="text-xs font-weight-bold mb-0">{data?.userDetails?.name}</p></td>
                                <td><p className="text-xs font-weight-bold mb-0">{data?.bookingDate}</p></td>
                                <td className="text-sm">
                                  <span
                                    className={`badge badge-sm 
                                      ${(data?.booking_status === "Rejected" || data?.booking_status === "Cancelled") && "bg-gradient-faded-danger"}  
                                      ${(data?.booking_status === "Requested" || data?.booking_status === "Pending") && "bg-gradient-faded-warning"} 
                                      ${data?.booking_status === "Completed" && "bg-success"}`}
                                  >{data?.booking_status}
                                  </span>
                                </td>
                                <td><button className="btn bg-gradient-primary mb-0 text-center" onClick={() => handleViewmore(data)}>View more</button></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <h5 className="mt-7 mb-6 text-dark">No details recorded</h5>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminBookingHistoryTable;