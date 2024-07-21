import React from 'react';
import backgroundImage from "/images/Login&RegisterBackground.jpg";
import { useNavigate } from 'react-router-dom';

const UserRegister = () => {

  const navigate = useNavigate();

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
                <form>
                  <input type="text" className="form-control mb-3" placeholder="Name" />
                  <input type="email" className="form-control mb-3" placeholder="Email" />
                  <input type="tel" className="form-control mb-3" placeholder="Phone number" />
                  <input type="password" className="form-control mb-3" placeholder="Password" />
                  <input type="password" className="form-control mb-3" placeholder="Confirm Password" />
                  <button type="button" className="btn bg-gradient-primary w-100 my-4 mb-2">Sign up</button>
                  <p className="text-sm mt-3 mb-0">
                    Already have an account? <a className="text-dark font-weight-bolder" style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>Sign in</a>
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