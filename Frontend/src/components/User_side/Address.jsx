import React from 'react';
import BackgroundShape from '../Common/backgroundShape';
import UserNavbar from './NavbarPage';
import AddressModal from './AddressModal';

const UserAddress = () => {

  return (
    <>
      <UserNavbar />
      <div className="page-header min-vh-75">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
              <div className="mt-5">
                <div className="card p-4 mb-3">
                  <div className='d-flex align-items-center justify-content-between w-100'>
                    <p className="font-weight-bold">Home Address</p>
                    <div>
                      <button className="btn bg-gradient-primary border-radius-xl p-1 px-4 mx-1">Edit</button>
                      <button className="btn btn-outline-primary border-radius-xl p-1 px-3">Delete</button>
                    </div>
                  </div>
                  <p className="font-weight-lighter text-sm m-0">Sameen K A,</p>
                  <p className="font-weight-lighter text-sm m-0">Kuruppassery palluruthy P O, Ernakulam</p>
                  <p className="font-weight-lighter text-sm m-0">688526</p>
                  <p className="font-weight-lighter text-sm m-0">9562718577, <span className='mx-2'>9961127410</span></p>
                  <p className="font-weight-lighter text-sm m-0"></p>
                </div>
                <div className="card p-4 mb-3">
                  <div className='d-flex align-items-center justify-content-between w-100'>
                    <p className="font-weight-bold">Home Address</p>
                    <div>
                      <button className="btn bg-gradient-primary border-radius-xl p-1 px-4 mx-1">Edit</button>
                      <button className="btn btn-outline-primary border-radius-xl p-1 px-3">Delete</button>
                    </div>
                  </div>
                  <p className="font-weight-lighter text-sm m-0">Sameen K A,</p>
                  <p className="font-weight-lighter text-sm m-0">Kuruppassery palluruthy P O, Ernakulam</p>
                  <p className="font-weight-lighter text-sm m-0">688526</p>
                  <p className="font-weight-lighter text-sm m-0">9562718577, <span className='mx-2'>9961127410</span></p>
                  <p className="font-weight-lighter text-sm m-0"></p>
                </div>
                <button className="btn bg-gradient-primary border-radius-xl w-100" data-bs-toggle="modal" data-bs-target="#exampleModal">Add Address</button>
              </div>
            </div>
            <BackgroundShape />
          </div>
        </div>
      </div>
      <AddressModal />
    </>
  );
}

export default UserAddress;