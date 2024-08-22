import { useState } from 'react';
import { toast } from 'sonner';
import userAxiosInstance from "../../config/AxiosInstance/userInstance";
import { useNavigate } from 'react-router-dom';

const BookingConfirmModalDetails = ({ setIsBookingOpen, technicianDetails }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const districtArray = ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"];
  const [openDistrictSession, setOpenDistrictSession] = useState(false);
  const [defaultDistrict, setDefaultDistrict] = useState(districtArray[1]);

  const [houseName, setHouseName] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [alternateNumber, setAlternateNumber] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!houseName.trim() || houseName.length > 100 || houseName.length < 10) {
      newErrors.houseName = "Name must be 10-100 characters long.";
    };
    if (!/^6\d{5}$/.test(pinCode)) {
      newErrors.pinCode = "Enter a valid PIN code.";
    };
    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid phone number.";
    };
    if (alternateNumber && !/^[6-9]\d{9}$/.test(alternateNumber)) {
      newErrors.alternateNumber = "Enter a valid alternate number.";
    };
    if (alternateNumber === phoneNumber) {
      newErrors.alternateNumber = "Alternate number cannot be the same as the primary number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const bookTechnician = async () => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const serviceLocation = {
        address: houseName,
        state: "Kerala",
        district: defaultDistrict,
        phone: phoneNumber,
        alternatePhone: alternateNumber,
        pincode: pinCode
      };
      const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
      await userAxiosInstance.post("/bookTechnician", { client_id: userDetails?.user_id, technicianDetails: technicianDetails, serviceLocation: serviceLocation });
      toast.success("Booking request sent successfully, please wait for the confirmation.");
      setIsBookingOpen(false)
    } catch (error) {
      if (error.response.status === 401) {
        navigate("/login", { state: { message: "Authorization failed, please login" } });
      } else if (error.response.status === 409) {
        toast.error("Booking failed. Please try again later.");
      } else if (error.response.status === 404) {
        toast.error("Technician not available now, please connect with another technician.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="row mx-4 h-100 d-flex align-items-center">
      <div className="col-lg-5 col-md-12 col-sm-12 card-plain d-flex flex-column justify-content-center px-5">
        <h5 className="mb-4">Disclaimer about Booking</h5>
        <p className="text-sm">
          Please provide your exact location for the service. Once booked, please wait for the technician to accept your request.
          You will receive a notification once the technician responds.
          <br />
          Thank you for your patience.
        </p>
      </div>

      <div className="col-lg-7 col-md-12 col-sm-12 card card-body shadow-blur d-flex justify-content-center align-items-center">
        <form className='mt-5 w-100' onSubmit={(e) => { e.preventDefault(); bookTechnician(); }}>

          <textarea className="form-control mt-3" placeholder="House name, House/ Flat number" style={{ minHeight: "50px", maxHeight: "150px" }} value={houseName} onChange={(e) => setHouseName(e.target.value)} />
          {errors.houseName && <p className="text-danger text-xs text-bold mt-1 ms-1">{errors.houseName}</p>}

          <input type="text" className="form-control mt-3" placeholder="PIN Code" value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
          {errors.pinCode && <p className="text-danger text-xs text-bold mt-1 ms-1">{errors.pinCode}</p>}

          <div className='d-flex justify-content-between'>
            <div className='w-100 me-1'>
              <input type="text" className="form-control mt-3" readOnly value={"Kerala"} />
            </div>
            <div className='w-100 ms-1'>
              {openDistrictSession ? (
                <div className='border rounded-3 mt-3 max-height-100' style={{ overflowY: 'auto' }}>
                  {districtArray.map((dist, index) => (
                    <p key={index} className='text-start text-sm border-radius-md mb-1 p-1 px-3 cursor-pointer'
                      onClick={() => { setDefaultDistrict(dist); setOpenDistrictSession(false); }}
                    >{dist}</p>
                  ))}
                </div>
              ) : (
                <div className='form-control mt-3 cursor-pointer' onClick={() => setOpenDistrictSession(true)}>{defaultDistrict}</div>
              )}
            </div>
          </div>

          <div className='d-flex justify-content-between'>
            <div className='w-100 me-1'>
              <input type="text" className="form-control mt-3" placeholder="Phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              {errors.phoneNumber && <p className="text-danger text-xs text-bold mt-1 ms-1">{errors.phoneNumber}</p>}
            </div>
            <div className='w-100 ms-1'>
              <input type="text" className="form-control mt-3" placeholder="Alternate number" value={alternateNumber} onChange={(e) => setAlternateNumber(e.target.value)} />
              {errors.alternateNumber && <p className="text-danger text-xs text-bold mt-1 ms-1">{errors.alternateNumber}</p>}
            </div>
          </div>

          <div className='d-flex justify-content-center align-items-center mt-4'>
            <button type="submit" className="btn bg-gradient-primary my-0" disabled={isLoading}>  {isLoading ? 'Booking...' : 'Book Service'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingConfirmModalDetails;