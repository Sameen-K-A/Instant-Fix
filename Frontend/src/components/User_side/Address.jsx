import React from 'react';
import BackgroundShape from '../Common/backgroundShape';
import UserNavbar from './NavbarPage';

const UserAddress = () => {

  return (
    <>
      <UserNavbar />
      <div className="page-header min-vh-75">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
              <div className="mt-5">
                <div className="card p-4">
                  <div className='d-flex align-items-center justify-content-between'>
                    <p className="font-weight-bold">Home Address</p>
                    <div>
                      <button className="btn bg-gradient-primary border-radius-xl p-1 w-20">Edit</button>
                      <button className="btn btn-outline-primary border-radius-xl p-1 w-20">Delete</button>
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

export default UserAddress;