import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import backgroundImage from "../../../public/Images/HeaderBanner_3.jpg";
import GoogleIcon from "../../../public/svgs/GoogleIcon";
import { toast } from 'sonner';
import axios from 'axios';
import { Base_URL } from '../../config/credentials';
import { useUserDetails } from '../../Contexts/UserDetailsContext'; 

const UserLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserDetails } = useUserDetails()

  useEffect(() => {
    if (location.state?.message) {
      if (location.state.message === "Registration process completed successfully, please login") {
        toast.success("Registration process completed successfully, please login.");
      } else if (location.state.message === "Authorization failed, please login") {
        toast.error(location.state.message);
      };
    };
  }, [location.state]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Please enter a valid email address.')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters long.')
        .required('Password is required')
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${Base_URL}/login`, values);
        console.log(response.data)
        sessionStorage.setItem("userToken", response.data.userToken);
        localStorage.setItem("userRefreshToken", response.data.userRefreshToken);
        sessionStorage.setItem("userDetails", JSON.stringify(response.data.userData));
        setUserDetails(response.data.userData);
        navigate("/");
      } catch (error) {
        if (error.response && error.response.data.message === "email not found") {
          toast.error("Email not found");
        } else if (error.response && error.response.data.message === "Wrong password") {
          toast.error("Password is wrong");
        } else if (error.response && error.response.data.message === "User is blocked") {
          toast.error("Your account has been blocked, please contact with our team.");
        } else {
          console.error("login error => ", error);
          toast.error("Something went wrong, please try again later.");
        }
      }
    }
  });

  const handleGoogleLogin = () => {
    try {
      const width = 1000;
      const height = 400;
      const left = (window.screen.width / 2) - (width / 2);
      const top = (window.screen.height / 2) - (height / 2);
      window.open('http://localhost:3000/auth/google', '_blank', `width=${width},height=${height},top=${top},left=${left}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="page-header pt-3 pb-10 m-3 border-radius-lg" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <span className="mask bg-gradient-primary opacity-2"></span>
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
            <div className="card blur shadow-blur">
              <div className="card-header text-center pt-5 pb-0">
                <h5>Login</h5>
              </div>
              <div className="card-body">
                <form onSubmit={formik.handleSubmit}>
                  <input type="text" className="form-control" placeholder="Email" {...formik.getFieldProps('email')} />
                  {formik.touched.email && formik.errors.email ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.email}</div> : null}
                  <input type="password" className="form-control mt-3" placeholder="Password" {...formik.getFieldProps('password')} />
                  {formik.touched.password && formik.errors.password ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.password}</div> : null}
                  <button type="submit" className="btn bg-gradient-primary w-100 my-4 mb-2" disabled={formik.isSubmitting}>Sign in</button>
                  <p className="text-sm my-2 mt-3 mb-3 text-center font-weight-bold">or</p>
                  <div className="btn btn-outline-light w-100 text-dark d-flex align-items-center justify-content-center" onClick={handleGoogleLogin}>
                    <GoogleIcon /> Login with Google
                  </div>
                  <p className="text-sm mt-3 mb-0">Don't have an account yet?
                    <a className="text-dark font-weight-bolder" style={{ cursor: "pointer" }} onClick={() => navigate("/register")}> <u>Register</u></a>
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