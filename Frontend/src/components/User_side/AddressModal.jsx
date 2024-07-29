import React, { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { Base_URL } from '../../config/credentials';

function AddressModal({ userAddress, setUserAddress }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [alternateNumber, setAlternateNumber] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    let isValid = true;
    if (name.trim().length < 4 || name.trim().length > 20) {
      toast.warning("Name must be between 4 and 20 characters");
      isValid = false;
    };
    if (address.trim().length < 4) {
      toast.warning("Address must be more than 3 characters");
      isValid = false;
    };
    const pinCodeRegex = /^6\d{5}$/;
    const phoneNumberRegex = /^[6-9]\d{9}$/;
    if (!pinCodeRegex.test(pinCode.trim())) {
      toast.warning("Enter valid pincode");
      isValid = false;
    };
    if (!phoneNumberRegex.test(phoneNumber.trim())) {
      toast.warning("Enter valid phone number");
      isValid = false;
    };
    if (!phoneNumberRegex.test(alternateNumber.trim())) {
      toast.warning("Enter valid alternate number");
      isValid = false;
    };
    if (phoneNumber.trim() === alternateNumber.trim()) {
      toast.warning("Primary number and Alternate number must need different.");
      isValid = false;
    }
    // everything is valid
    if (isValid) {
      try {
        const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        const user_id = userDetails?.user_id;
        const response = await axios.post(`${Base_URL}/address`, {
          user_id: user_id,
          name: name,
          address: address,
          pincode: pinCode,
          phone: phoneNumber,
          alternatePhone: alternateNumber
        });
        setUserAddress([...userAddress, response.data]);

        // Close the modal
        const modal = document.getElementById('exampleModal');
        const backdrop = document.querySelector('.modal-backdrop');
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
        if (backdrop) backdrop.remove();
        document.body.classList.remove('modal-open');
        document.body.style = '';
        toast.success("The address has been added successfully.");
        setName("");
        setAddress("");
        setPinCode("");
        setPhoneNumber("");
        setAlternateNumber("");
      } catch (error) {
        console.log(error);
        toast.error("Can't add new Address, something wrong please try again later.")
      }
    }
  };

  return (
    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body p-4 pt-5">
            <h5 className="modal-title" id="exampleModalLabel">Add address</h5>
            <form className='my-4' onSubmit={handleSubmit}>
              <input type="text" className="form-control mb-3" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <textarea className="form-control mb-3" placeholder="House name, House/ Flat number, District" style={{ minHeight: "50px", maxHeight: "150px" }} value={address} onChange={(e) => setAddress(e.target.value)} />
              <input type="text" className="form-control mb-3" placeholder="PIN Code" value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
              <div className='d-flex'>
                <input type="text" className="form-control me-2" placeholder="Phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                <input type="text" className="form-control" placeholder="Alternate number" value={alternateNumber} onChange={(e) => setAlternateNumber(e.target.value)} />
              </div>
              <div className='d-flex justify-content-center align-items-center mt-4'>
                <button type="button" className="btn btn-outline-primary w-30 me-3 my-0" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn bg-gradient-primary w-30 my-0">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressModal;