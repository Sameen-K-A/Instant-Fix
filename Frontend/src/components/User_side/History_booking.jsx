import BackgroundShape from "../Common/backgroundShape";
import UserNavbar from "./NavbarPage";

const UserBookingHistoryTable = () => {
  return (
    <>
      <UserNavbar />
      <div className="page-header min-vh-75">
        <div className="container">
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 d-flex flex-column" style={{ zIndex: "1" }}>
              <div className="container-fluid">
                <div className="card mb-4">
                  <div className="card-header pb-0 mb-3 mt-3">
                    <h5 className="text-center mb-3">Booking History</h5>
                  </div>
                  <div className="card-body px-0 pt-0 pb-2">
                    <div className="table-responsive p-0 pb-3">
                      <table className="table align-items-center mb-0">
                        <thead>
                          <tr>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Booking ID</th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Technician Name</th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Booking Date</th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Service Type</th>
                            <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">More Details</th>
                          </tr>
                        </thead>
                        <tbody className="text-center">
                          <tr>
                            <td><p className="text-xs font-weight-bold mb-0">#AbJ12345</p></td>
                            <td><p className="text-xs font-weight-bold mb-0">John Michael</p></td>
                            <td><p className="text-xs font-weight-bold mb-0">23/04/18</p></td>
                            <td className=" text-sm"><span className="badge badge-sm bg-gradient-faded-warning">Pending</span></td>
                            <td><p className="text-xs font-weight-bold mb-0">AC Mechanic</p></td>
                            <td><button className="btn bg-gradient-info mb-0 text-center">View more</button></td>
                          </tr>
                          <tr>
                            <td><p className="text-xs font-weight-bold mb-0">#AbJ12345</p></td>
                            <td><p className="text-xs font-weight-bold mb-0">John Michael</p></td>
                            <td><p className="text-xs font-weight-bold mb-0">23/04/18</p></td>
                            <td className=" text-sm"><span className="badge badge-sm bg-gradient-danger">Canceled</span></td>
                            <td><p className="text-xs font-weight-bold mb-0">AC Mechanic</p></td>
                            <td><button className="btn bg-gradient-info mb-0 text-center">View more</button></td>
                          </tr>
                          <tr>
                            <td><p className="text-xs font-weight-bold mb-0">#AbJ12345</p></td>
                            <td><p className="text-xs font-weight-bold mb-0">John Michael</p></td>
                            <td><p className="text-xs font-weight-bold mb-0">23/04/18</p></td>
                            <td className=" text-sm"><span className="badge badge-sm bg-gradient-success">Completed</span></td>
                            <td><p className="text-xs font-weight-bold mb-0">AC Mechanic</p></td>
                            <td><button className="btn bg-gradient-info mb-0 text-center">View more</button></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
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