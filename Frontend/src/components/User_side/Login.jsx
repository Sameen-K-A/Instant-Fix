import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from "/images/Login&RegisterBackground.jpg";
import GoogleIcon from "../../../public/svgs/GoogleIcon";

const UserLogin = () => {

  const navigate = useNavigate();

  return (
    <>
      <div className="page-header pt-3 pb-10 m-3 border-radius-lg" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <span className="mask bg-gradient-primary opacity-8"></span>
        <div className="container">
          <div className="col-lg-5 text-center mx-auto">
            <h1 className="text-white mb-2 mt-5">Welcome Back</h1>
            <p className="text-white">Hello mate, Fix your issues. We're with you every step of the way!</p>
          </div>
        </div>
      </div>
      <div className="container mb-5">
        <div className="row mt-lg-n10 mt-md-n11 mt-n10">
          <div className="col-xl-4 col-lg-5 col-md-7 mx-auto">
            <div className="card">
              <div className="card-header text-center pt-5">
                <h5>Login</h5>
              </div>
              <div className="card-body">
                <div className="btn btn-outline-light w-100 text-dark d-flex align-items-center justify-content-center">
                  <GoogleIcon />Login with Google
                </div>
                <p className="text-sm my-2 mb-3 text-center font-weight-bold">or</p>
                <form role="form text-left">
                  <input type="email" className="form-control mb-3" placeholder="Email" />
                  <input type="password" className="form-control mb-3" placeholder="Password" />
                  <button type="button" className="btn bg-gradient-primary w-100 my-4 mb-2">Sign in</button>
                  <p className="text-sm mt-3 mb-0">
                    Don't have an account yet? <a className="text-dark font-weight-bolder" style={{ cursor: "pointer" }} onClick={() => navigate("/register")}>Register</a>
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

export default UserLogin;