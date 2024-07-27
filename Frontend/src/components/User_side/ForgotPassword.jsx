import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from "/images/Login&RegisterBackground.jpg";

const UserForgotPassword = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_password] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();

  const verifyEmail = () => {
    setEmailVerified(true);
  }

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
        <div className="row mt-lg-n9 mt-md-n11 mt-n10">
          <div className="col-xl-4 col-lg-5 col-md-7 mx-auto">
            <div className="card">
              <div className="card-header text-center pt-5">
                <h5>Forgot Password</h5>
              </div>
              <div className="card-body">
                {!emailVerified ? (
                  <>
                    <input type="text" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <p className="text-sm mt-2 mb-0 font-weight-bolder text-danger text-end px-1">
                      <u className='cursor-pointer' onClick={() => verifyEmail()}>Verfiy</u>
                    </p>
                  </>
                ) : (
                  <div className="card-body">
                    <form>
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
                )}
                <p className="text-sm mt-3 mb-0">Back to login page?
                  <a className="text-sm mt-3 mb-0 text-dark font-weight-bolder cursor-pointer" onClick={() => navigate("/Login")}> <u>Login</u></a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserForgotPassword;