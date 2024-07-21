import React from 'react';
import BackgroundShape from '../Common/backgroundShape';
import RatingStar from '../Common/StarRating';
import UserNavbar from './NavbarPage';

const UserHistoryViewMore = () => {
  return (
    <>
      <UserNavbar />
      <div className="page-header min-vh-75">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-9 col-md-10 col-12 d-flex flex-column" style={{ zIndex: 1 }}>
              <div className="card card-plain mt-8">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-lg-6 mb-lg-0 mb-4">
                      <h3 className="font-weight-bolder mt-3 mb-4 text-info text-gradient">Completed</h3>
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="table-responsive pb-3 col-xl-12 col-lg-12 col-md-11 col-11">
                            <table className="table align-items-center mb-0">
                              <tbody>
                                <tr>
                                  <td><p className="text-xs mb-0">Booking ID</p></td>
                                  <td><p className="text-xs font-weight-bold mb-0">#AbJ12345</p></td>
                                </tr>
                                <tr>
                                  <td><p className="text-xs mb-0">Service type</p></td>
                                  <td><p className="text-xs font-weight-bold mb-0">AC Mechanic</p></td>
                                </tr>
                                <tr>
                                  <td><p className="text-xs mb-0">Booking Date</p></td>
                                  <td><p className="text-xs font-weight-bold mb-0">13 / 05 / 2024</p></td>
                                </tr>
                                <tr>
                                  <td><p className="text-xs mb-0">Service Date</p></td>
                                  <td><p className="text-xs font-weight-bold mb-0">14 / 05 / 2024</p></td>
                                </tr>
                                <tr>
                                  <td><p className="text-xs mb-0">Service Location</p></td>
                                  <td><p className="text-xs font-weight-bold mb-0">
                                    user name, Maradu, <br />
                                    Ernakulam, PIN Code, <br />
                                    PH : 987654321</p></td>
                                </tr>
                                <tr>
                                  <td><p className="text-xs mb-0">Service Cost</p></td>
                                  <td><p className="text-xs font-weight-bold mb-0">950₹ /-</p></td>
                                </tr>
                                <tr>
                                  <td><p className="text-xs mb-0">Payment Status</p></td>
                                  <td><p className="text-xs font-weight-bold mb-0">Completed</p></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 mb-5 px-5">
                      <div className="text-center mb-3" style={{ width: "150px", borderRadius: "50%", margin: "0 auto" }}>
                        <img src="https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369990.png" width="150" className="rounded-circle" alt="User Profile" />
                        <h6>Technician Name</h6>
                      </div>
                      <hr className='horizontal dark' />
                      <div className='d-flex justify-content-around'>
                        <p className='text-sm font-weight-bold text-dark'>Give your rating</p>
                        <RatingStar />
                      </div>
                      <textarea placeholder='Enter you feedback' className='form-control' style={{ padding: "10px", maxHeight: "120px", minHeight: "50px" }} />
                      <button className='btn bg-gradient-primary w-100 mt-3'>Submit</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <BackgroundShape />
        </div>
      </div>
    </>
  )
};

export default UserHistoryViewMore;