import React, { useState } from 'react';
import backgroundImage from "/images/Login&RegisterBackground.jpg";
import { useNavigate } from 'react-router-dom';
import { Base_URL } from '../../config/credentials';
import axios from "axios";
import { toast } from 'sonner';

const UserRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_password] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    event.preventDefault();
    let isValid = true;
    if (name.length < 3 || name.length > 20) {
      toast.warning("Username must be between 3 and 20 characters.");
      isValid = false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.warning("Please enter a valid email address.");
      isValid = false;
    }
    const phoneNumberRegex = /^[6-9]\d{9}$/;
    if (!phoneNumberRegex.test(phone)) {
      toast.warning("Please enter a valid phone number.");
      isValid = false;
    }
    if (password.length < 8) {
      toast.warning("Password must be at least 8 characters long.");
      isValid = false;
    }
    if (password !== confirm_password) {
      toast.warning("Confirm password does not match.");
      isValid = false;
    }
    if (isValid) {
      try {
        setIsLoading(true);
        const response = await axios.post(`${Base_URL}/register`, { name, email, phone, password });
        const OTP = response.data.OTP;
        const expiryTime = response.data.expiryTime;
        const userData = response.data.userData;
        sessionStorage.setItem("userOTPDetails", JSON.stringify({ OTP: OTP, expiryTime: expiryTime }));
        sessionStorage.setItem("userDatas", JSON.stringify(userData));
        navigate("/otp", { state: { message: "OTP sent to your email. Please check it" } });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        if (error.response.data.message === "Email already exists") {
          toast.error("Email already exists. Please check your email.");
        } else if (error.response.data.message === "OTP not sent") {
          toast.error("OTP not sent. We can't find your email.");
        } else {
          console.log("Registration error =>", error);
          toast.error("Something wrong please try again later.");
        }
      }
    }
  }

  return (
    <>
      <div className="page-header pt-3 pb-10 m-3 border-radius-lg" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <span className="mask bg-gradient-primary opacity-8"></span>
        <div className="container">
          <div className="col-lg-5 text-center mx-auto">
            <h1 className="text-white mb-2 mt-5">Welcome</h1>
            <p className="text-white">Hello mate, Fix your issues. We're with you every step of the way!</p>
          </div>
        </div>
      </div>
      <div className="container mb-5">
        <div className="row mt-lg-n10 mt-md-n11 mt-n10">
          <div className="col-xl-4 col-lg-5 col-md-7 mx-auto">
            <div className="card">
              <div className="card-header text-center pt-5">
                <h5>Register</h5>
              </div>
              <div className="card-body">
                <form onSubmit={() => handleRegister()}>
                  <input type="text" className="form-control mb-3" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                  <input type="text" className="form-control mb-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <div className='d-flex'>
                    <input className="form-control mb-3 w-20 me-2" readOnly defaultValue={"+91"} />
                    <input type="text" className="form-control mb-3" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <input type="password" className="form-control mb-3" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <input type="password" className="form-control mb-3" placeholder="Confirm Password" value={confirm_password} onChange={(e) => setConfirm_password(e.target.value)} />
                  {!isLoading ? (
                    <button type="submit" className="btn bg-gradient-primary w-100 my-4 mb-2">Sign up</button>
                  ) : (
                    <button type="button" className="btn bg-gradient-primary w-100 my-4 mb-2">Loading . . .</button>
                  )}
                  <p className="text-sm mt-3 mb-0">
                    Already have an account? <a className="text-dark font-weight-bolder" style={{ cursor: "pointer" }} onClick={() => navigate("/login")}><u>Sign in</u></a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRegister;