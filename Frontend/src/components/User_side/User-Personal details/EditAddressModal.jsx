import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import userAxiosInstance from '../../../config/AxiosInstance/userInstance';

function EditAddressModal({ changingAddress, userAddress, setUserAddress }) {
  const navigate = useNavigate();
  const [address_id, setAddress_id] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [alternateNumber, setAlternateNumber] = useState('');

  useEffect(() => {
    if (changingAddress) {
      setAddress_id(changingAddress?.address_id);
      setName(changingAddress?.name);
      setAddress(changingAddress?.address);
      setPinCode(changingAddress?.pincode);
      setPhoneNumber(changingAddress?.phone);
      setAlternateNumber(changingAddress?.alternatePhone);
    }
  }, [changingAddress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    if (!pinCodeRegex.test(pinCode.trim())) {
      toast.warning("Enter valid pincode");
      isValid = false;
    };
    const phoneNumberRegex = /^[6-9]\d{9}$/;
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

    if (isValid) {
      try {
        await userAxiosInstance.put(`/address`, {
          address_id: address_id,
          name: name,
          address: address,
          pincode: pinCode,
          phone: phoneNumber,
          alternatePhone: alternateNumber
        });

        const updatedAddresses = userAddress.map((addr) =>
          addr.address_id === address_id
            ? { ...addr, name: name, address: address, pincode: pinCode, phone: phoneNumber, alternatePhone: alternateNumber }
            : addr
        );
        setUserAddress(updatedAddresses);
        toast.success("Address updated successfully!");

        // closing my edit address modal
        const modal = document.getElementById('editAddressModal');
        const backdrop = document.querySelector('.modal-backdrop');
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
        if (backdrop) backdrop.remove();
        document.body.classList.remove('modal-open');
        document.body.style = '';

      } catch (error) {
        if (error.response?.status === 304) {
          toast.warning("No changes found.");
        } else if (error.response?.status === 401) {
          navigate("/login", { state: { message: "Authorization failed, please login." } });
        } else {
          console.error("Error:", error);
          toast.error("Something went wrong, please try again later.");
        }
      }
    }
  };

  return (
    <div className="modal fade" id="editAddressModal" tabIndex="-1" aria-labelledby="editAddressModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body p-4 pt-5">
            <h5 className="modal-title" id="editAddressModalLabel">Edit address</h5>
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
                <button type="submit" className="btn bg-gradient-primary w-30 my-0">Change</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditAddressModal;