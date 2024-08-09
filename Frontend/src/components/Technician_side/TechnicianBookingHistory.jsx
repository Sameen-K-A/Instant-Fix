import { useEffect, useState } from "react";
import BackgroundShape from "../Common/backgroundShape";
import TechnicianNavbar from "./NavbarPage"
import userAxiosInstance from "../../config/AxiosInstance/userInstance";
import { toast } from "sonner";

const TechnicianBookingHistoryTable = () => {

  const [bookingDetailsArray, setBookingDetailsArray] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        const response = await userAxiosInstance.get("/technician/fetchTechnicianBookingHistory", {
          params: {
            technicianUserID: userDetails?.user_id
          }
        });
        setBookingDetailsArray(response.data);
      } catch (error) {
        toast.error("Can't fetch booking history, Please try again later");
      }
    })();
  }, []);

  return (
    <>
      <TechnicianNavbar />
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
                                  <td className="text-xs text-bold"><p className="text-xs font-weight-bold mb-0"></p>{index + 1 < 10 ? `0${index+1}` : index + 1}</td>
                                  <td><p className="text-xs font-weight-bold mb-0">{data?.userDetails?.name}</p></td>
                                  <td><p className="text-xs font-weight-bold mb-0">{data?.bookingDate}</p></td>
                                  <td><p className="text-xs font-weight-bold mb-0">{data?.bookingTime}</p></td>
                                  <td className=" text-sm"><span className="badge badge-sm bg-gradient-faded-warning">{data?.booking_status}</span></td>
                                  <td><button className="btn bg-gradient-info mb-0 text-center">View more</button></td>
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
                    <h5 className="mt-7 text-dark">No details found</h5>
                    <p>Please stay available to receive new bookings from clients.</p>
                    <p className="text-sm text-black-50 mb-2">To change your availability, follow these steps:</p>
                    <ol className="text-sm text-black-50">
                      <li>Tap on your profile in the top right corner.</li>
                      <li>Click on "Account Details."</li>
                      <li>Change your availability.</li>
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

export default TechnicianBookingHistoryTable;