import React, { useState } from 'react';
import backgroundImage from "/images/Login&RegisterBackground.jpg";
import { useNavigate } from 'react-router-dom';
import { Base_URL } from '../../config/credentials';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

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
      toast("Username must be between 3 and 20 characters.", { hideProgressBar: true, autoClose: 5000, closeButton: false });
      isValid = false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast("Please enter a valid email address.", { hideProgressBar: true, autoClose: 5000, closeButton: false });
      isValid = false;
    }
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phone)) {
      toast("Please enter a valid 10-digit phone number.", { hideProgressBar: true, autoClose: 5000, closeButton: false });
      isValid = false;
    }
    if (password.length < 8) {
      toast("Password must be at least 8 characters long.", { hideProgressBar: true, autoClose: 5000, closeButton: false });
      isValid = false;
    }
    if (password !== confirm_password) {
      toast("Confirm password does not match.", { hideProgressBar: true, autoClose: 5000, closeButton: false });
      isValid = false;
    }
    if (isValid) {
      try {
        setIsLoading(true)
        const response = await axios.post(`${Base_URL}/register`, { name, email, phone, password, confirm_password });
        if (response.data.serviceResponse == "Email already exists") {
          toast("Email already exists.", { hideProgressBar: true, autoClose: 5000, closeButton: false });
        } else if (response.data.serviceResponse == "OTP not sended") {
          toast.error("Something wrong please try again later", { hideProgressBar: true, autoClose: 5000, closeButton: false });
        } else {
          localStorage.setItem("userOTP", response.data.serviceResponse);
          localStorage.setItem("userDatas", JSON.stringify(response.data.userData));
          setIsLoading(false);
          navigate("/otp");
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
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