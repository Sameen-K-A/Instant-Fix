import React, { useEffect, useState } from 'react';
import BackgroundShape from '../Common/backgroundShape';
import UserNavbar from './NavbarPage';
import { Base_URL } from '../../config/credentials';

const UserProfile = () => {

  const [isEdit, setIsEdit] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  useEffect(() => {
    setUserDetails(JSON.parse(sessionStorage.getItem("userDetails")));
  }, []);

  return (
    <>
      <UserNavbar />
      <div className="page-header min-vh-75">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
              <div className="mt-5">
                {userDetails && (
                  <>
                    <div className="text-center position-relative">
                      <img src={`${Base_URL}/${userDetails?.profileIMG}`} width="200" className="rounded-circle" alt="User Profile" />
                    </div>
                    <div className="text-center mt-3">
                      {isEdit ? (
                        <>
                          <input type="text" className="form-control mt-3" placeholder="Name" defaultValue={userDetails?.name} />
                          <input type="text" className="form-control mt-3" placeholder="Phone Number" defaultValue={userDetails?.phone} />
                          <input type="password" className="form-control mt-3" placeholder="Change Password" />
                          <input type="password" className="form-control mt-3" placeholder="Confirm Password" />
                          <div className="buttons mt-3">
                            <button className="btn btn-outline-primary w-30 px-3" onClick={() => setIsEdit(false)}>Cancel</button>
                            <button className="btn bg-gradient-primary w-30 px-4 ms-3">Save</button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h4 className="mt-2 mb-2">{userDetails?.name}</h4>
                          <p className='mb-2'>{userDetails?.email}</p>
                          <p>+91 {userDetails?.phone}</p>
                          <button className="btn bg-gradient-primary px-4 mt-2 w-50" onClick={() => setIsEdit(true)}>Edit</button>
                        </>
                      )}
                    </div>
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

export default UserProfile;