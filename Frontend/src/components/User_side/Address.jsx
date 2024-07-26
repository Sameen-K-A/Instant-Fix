import React, { useEffect, useState } from 'react';
import BackgroundShape from '../Common/backgroundShape';
import UserNavbar from './NavbarPage';
import AddressModal from './AddressModal';
import axios from "axios";
import { Base_URL } from '../../config/credentials';
import confirmAlert from "../Common/SweetAlert/confirmAlert";
import { toast } from 'sonner';

const UserAddress = () => {

  const [userAddress, setUserAddress] = useState([]);
  useEffect(() => {
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    const user_id = userDetails?.user_id;
    const fetchAddress = async () => {
      const response = await axios.get(`${Base_URL}/address?user_id=${user_id}`);
      setUserAddress(response.data);
    };
    fetchAddress();
  }, []);

  const handleDelete = (address_id) => {
    confirmAlert("Do you want to delete this Address")
      .then(async (result) => {
        if (result.isConfirmed) {
          const response = await axios.delete(`${Base_URL}/address?address_id=${address_id}`);
          if (response.data === "Deleted successfully") {
            const afterDeletedAddressArray = userAddress.filter((address) => address.address_id != address_id);
            setUserAddress(afterDeletedAddressArray);
            toast.success("The address has been deleted successfully.", { hideProgressBar: true, autoClose: 5000, closeButton: false });
          } else {
            toast.warning("Something wrong please try again later");
          }
        }
      })
  }

  return (
    <>
      <UserNavbar />
      <div className="page-header min-vh-75">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
              <div className="mt-5">
                {!userAddress.length ? (
                  <p className="text-center text-sm mb-5"><strong className='text-lg'>Address not founded </strong><br /> please add new Address</p>
                ) : (
                  userAddress.map((address, index) => {
                    return (
                      <div key={address?.address_id} className="card p-4 mb-3">
                        <div className='d-flex align-items-center justify-content-between w-100'>
                          <p className="font-weight-bold">Address {index + 1}</p>
                          <div>
                            <button className="btn bg-gradient-primary border-radius-xl p-1 px-4 mx-1">Edit</button>
                            <button className="btn btn-outline-primary border-radius-xl p-1 px-3" onClick={() => handleDelete(address?.address_id)}>Delete</button>
                          </div>
                        </div>
                        <p className="font-weight-lighter text-sm m-0">{address?.name},</p>
                        <p className="font-weight-lighter text-sm m-0">{address?.address}</p>
                        <p className="font-weight-lighter text-sm m-0">{address?.pincode}</p>
                        <p className="font-weight-lighter text-sm m-0">{address?.phone}, <span className='mx-2'>{address?.alternatePhone}</span></p>
                        <p className="font-weight-lighter text-sm m-0"></p>
                      </div>
                    )
                  })
                )}
                {userAddress.length < 2 && (
                  <button className="btn bg-gradient-primary border-radius-xl w-100" data-bs-toggle="modal" data-bs-target="#exampleModal">Add Address</button>
                )}
              </div>
            </div>
            <BackgroundShape />
          </div>
        </div>
      </div>
      <AddressModal userAddress={userAddress} setUserAddress={setUserAddress} />
    </>
  );
}

export default UserAddress;