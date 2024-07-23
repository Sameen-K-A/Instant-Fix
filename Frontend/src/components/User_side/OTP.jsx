import React, { useState, useRef, useEffect } from 'react';
import backgroundImage from "/images/Login&RegisterBackground.jpg";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Base_URL } from '../../config/credentials';

const UserOTP = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [minutes, setMinutes] = useState(2);
  const [seconds, setSeconds] = useState(0);
  const navigate = useNavigate();

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

  const handleOTPverification = async () => {
    event.preventDefault();
    const enteredOTP = otp.join("");
    const orginalOTP = localStorage.getItem("userOTP");
    if (enteredOTP === orginalOTP) {
      const userDatas = JSON.parse(localStorage.getItem("userDatas"));
      const response = await axios.post(`${Base_URL}/verifyotp`, userDatas);
      console.log(response.data);
      localStorage.removeItem("userOTP");
      localStorage.removeItem("userDatas");
      navigate("/login");
    } else {
      toast.error("Invalid OTP", { hideProgressBar: true, autoClose: 4000, closeButton: false });
    }
  }

  return (
    <>
      <ToastContainer position='bottom-right' className="text-dark font-weight-light text-sm" />
      <div className="page-header pt-3 pb-10 m-3 border-radius-lg" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <span className="mask bg-gradient-primary opacity-8"></span>
        <div className="container">
          <div className="col-lg-5 text-center mx-auto">
            <h1 className="text-white mb-2 mt-5">Welcome</h1>
            <p className="text-white">Verify your OTP for the secure authentication</p>
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
                <form onSubmit={() => handleOTPverification()}>
                  <div className='d-flex justify-content-center align-item-center'>
                    {otp.map((value, index) => {
                      return (
                        <input
                          key={index + 1}
                          type="text"
                          className="otp-div mx-2 text-dark font-weight-bolder"
                          maxLength={1}
                          value={value}
                          autoFocus={index === 0}
                          onChange={(e) => handleChange(e.target.value, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          ref={(box) => inputRefs.current[index] = box}
                        />
                      );
                    })}
                  </div>
                  {(minutes || seconds) ? (
                    <p className='mb-0 mt-4 text-center font-weight-bolder'>
                      {minutes.toString().padStart(2, '0')} : {seconds.toString().padStart(2, '0')}
                    </p>
                  ) : <p className='mb-0 mt-4 text-center text-sm pb-4'>Timer has expired.
                    <a className="font-weight-bolder" style={{ cursor: "pointer" }}> <u>Resend again</u></a>
                  </p>}
                  {(minutes || seconds) ? <button type="submit" className="btn bg-gradient-primary w-100 my-4 mb-4 ">Verify</button> : ""}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserOTP;