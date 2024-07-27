import React, { useState, useRef, useEffect } from 'react';
import backgroundImage from "/images/Login&RegisterBackground.jpg";
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Base_URL } from '../../config/credentials';

const UserOTP = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [minutes, setMinutes] = useState(2);
  const [seconds, setSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
    }
  }, [location.state]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) setSeconds(seconds - 1);
      if (seconds === 0) {
        if (minutes === 0) clearInterval(timer);
        else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds, minutes]);

  const handleChange = (value, index) => {
    if (/^[0-9]$/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOtp(newOTP);
      if (index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace") {
      const newOTP = [...otp];
      newOTP[index] = "";
      setOtp(newOTP);
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleOTPverification = async (event) => {
    event.preventDefault();
    const enteredOTP = otp.join("");
    const OTP_details = JSON.parse(sessionStorage.getItem("userOTPDetails"));
    if (enteredOTP !== OTP_details.OTP) {
      return toast.error("Invalid OTP");
    }
    const currentTime = new Date();
    const expiryTime = new Date(OTP_details.expiryTime);
    if (currentTime > expiryTime) {
      return toast.error("OTP has expired");
    }
    try {
      const userDatas = JSON.parse(sessionStorage.getItem("userDatas"));
      await axios.post(`${Base_URL}/verifyotp`, userDatas);
      sessionStorage.removeItem("userOTPDetails");
      sessionStorage.removeItem("userDatas");
      navigate("/login", { state: { message: "Registration process completed successfully, please login" } });
    } catch (error) {
      console.log("OTP verification error =>", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const resendOTP_handle = async () => {
    setIsLoading(true);
    const userDetails = JSON.parse(sessionStorage.getItem("userDatas"));
    const userEmail = userDetails.email;
    try {
      const response = await axios.post(`${Base_URL}/resendOTP`, { email: userEmail });
      const OTP = response.data.OTP;
      const expiryTime = response.data.expiryTime;
      sessionStorage.setItem("userOTPDetails", JSON.stringify({ OTP: OTP, expiryTime: expiryTime }));
      toast.success("OTP sent to your email. Please check it.");
      setMinutes(2);
      setSeconds(0);
      setOtp(["", "", "", ""]);
    } catch (error) {
      if (error.response.data.message === "OTP not sent") {
        toast.error("OTP not sent. We can't find your email.");
      } else {
        console.log("Resend OTP error =>", error);
        toast.error("Something wrong please try again later.");
      }
    }
    setIsLoading(false);
  }

  return (
    <>
      <div className="page-header pt-3 pb-10 m-3 border-radius-lg" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <span className="mask bg-gradient-primary opacity-8"></span>
        <div className="container">
          <div className="col-lg-5 text-center mx-auto">
            <h1 className="text-white mb-2 mt-5">Welcome</h1>
            <p className="text-white">Verify your OTP for secure authentication</p>
          </div>
        </div>
      </div>
      <div className="container mb-5">
        <div className="row mt-lg-n10 mt-md-n11 mt-n10">
          <div className="col-xl-4 col-lg-5 col-md-7 mx-auto">
            <div className="card">
              <div className="card-header text-center pt-5">
                <h5>OTP Verification</h5>
                <p className='text-sm'>Enter the 4-digit OTP you have received in your email</p>
              </div>
              <div className="card-body" style={{ marginTop: "-30px" }}>
                <form onSubmit={handleOTPverification}>
                  <div className='d-flex justify-content-center align-items-center'>
                    {otp.map((value, index) => (
                      <input
                        key={index}
                        type="text"
                        className="otp-div mx-2 text-dark font-weight-bolder"
                        maxLength={1}
                        value={value}
                        autoFocus={index === 0}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        ref={(box) => inputRefs.current[index] = box}
                      />
                    ))}
                  </div>
                  {(minutes || seconds) ? (
                    <>
                      <p className='mb-0 mt-4 text-center font-weight-bolder'>
                        {minutes.toString().padStart(2, '0')} : {seconds.toString().padStart(2, '0')}
                      </p>
                      <div className="mt-2">
                        <p className="font-weight-bolder text-xs " style={{ cursor: "pointer", marginBottom: "-10px" }} onClick={resendOTP_handle}>
                          <u>Resend again?</u>
                        </p>
                        <br />
                        {isLoading ? (
                          <button type="button" className="btn bg-gradient-primary w-100 mt-0">Loading . . .</button>
                        ) : (
                          <button type="submit" className="btn bg-gradient-primary w-100 mt-0">Verify</button>
                        )}
                      </div>
                    </>
                  ) : (
                    isLoading ? (
                      <p className='mb-0 mt-4 text-center text-sm pb-4'>Please wait . . .</p>
                    ) : (
                      <p className='mb-0 mt-4 text-center text-sm pb-4'>
                        Timer has expired.
                        <a className="font-weight-bolder" style={{ cursor: "pointer" }} onClick={resendOTP_handle}> Resend OTP</a>
                      </p>
                    )
                  )}
                </form>
              </div>
            </div>
          </div>
        </div >
      </div >
    </>
  );
};

export default UserOTP;