import React, { useState } from 'react';
import BackgroundShape from '../Common/backgroundShape';
import UserNavbar from './NavbarPage';

const UserProfile = () => {

  const [isEdit, setIsEdit] = useState(false);

  return (
    <>
      <UserNavbar />
      <div className="page-header min-vh-75">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
              <div className="mt-5">
                <div className="text-center position-relative">
                  <img src="https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369990.png" width="200" className="rounded-circle" alt="User Profile" />
                </div>
                <div className="text-center mt-3">
                  {isEdit ? (
                    <>
                      <div className="d-flex justify-content-between">
                        <input type="text" className="form-control me-2" placeholder="First Name" />
                        <input type="text" className="form-control ms-2" placeholder="Last Name" />
                      </div>
                      <input type="text" className="form-control mt-3" placeholder="Phone Number" />
                      <input type="password" className="form-control mt-3" placeholder="Change Password" />
                      <input type="password" className="form-control mt-3" placeholder="Confirm Password" />
                      <div className="buttons mt-3">
                        <button className="btn btn-outline-primary w-30 px-3" onClick={() => setIsEdit(false)}>Cancel</button>
                        <button className="btn bg-gradient-primary w-30 px-4 ms-3">Save</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h4 className="mt-2 mb-2">User Name</h4>
                      <p className='mb-2'>useruser123@gmail.com</p>
                      <p>+91 9876543210</p>
                      <button className="btn bg-gradient-primary px-4 mt-2 w-50" onClick={() => setIsEdit(true)}>Edit</button>
                    </>
                  )}
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

export default UserProfile;