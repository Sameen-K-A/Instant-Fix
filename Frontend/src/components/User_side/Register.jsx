import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Base_URL } from '../../config/credentials';
import axios from 'axios';
import backgroundImage from "/images/HeaderBanner_3.jpg";
import { toast } from 'sonner';

const UserRegister = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: ''
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(3, 'Username must be between 3 and 20 characters.')
        .max(20, 'Username must be between 3 and 20 characters.')
        .required('Name is required'),
      email: Yup.string()
        .email('Please enter a valid email address.')
        .required('Email is required'),
      phone: Yup.string()
        .matches(/^[6-9]\d{9}$/, 'Please enter a valid phone number.')
        .required('Phone number is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters long.')
        .required('Password is required'),
      confirm_password: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Confirm password does not match.')
        .required('Confirm password is required')
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        await axios.post(`${Base_URL}/register`, { ...values });
        navigate("/otp", { state: { message: "OTP sent to your email. Please check it" } });
      } catch (error) {
        if (error.response.data.message === "Email already exists") {
          toast.error("Email already exists.");
        } else if (error.response.data.message === "OTP not sent") {
          toast.error("OTP not sent. We can't find your email.");
        } else {
          console.log("Registration error =>", error);
          toast.error("Something wrong please try again later.");
        }
      }
    }
  });

  return (
    <>
      <div className="page-header pt-3 pb-10 m-3 border-radius-lg" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <span className="mask bg-gradient-primary opacity-2"></span>
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
            <div className="card blur shadow-blur">
              <div className="card-header text-center pt-5">
                <h5>Register</h5>
              </div>
              <div className="card-body">
                <form onSubmit={formik.handleSubmit}>
                  <input type="text" className="form-control" placeholder="Name" {...formik.getFieldProps('name')} />
                  {formik.touched.name && formik.errors.name ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.name}</div> : null}
                  <input type="text" className="form-control mt-3" placeholder="Email" {...formik.getFieldProps('email')} />
                  {formik.touched.email && formik.errors.email ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.email}</div> : null}
                  <div className='d-flex'>
                    <input className="form-control mt-3 w-20 me-2" readOnly defaultValue={"+91"} />
                    <input type="text" className="form-control mt-3" placeholder="Phone number" {...formik.getFieldProps('phone')} />
                  </div>
                  {formik.touched.phone && formik.errors.phone ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.phone}</div> : null}
                  <input type="password" className="form-control mt-3" placeholder="Password" {...formik.getFieldProps('password')} />
                  {formik.touched.password && formik.errors.password ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.password}</div> : null}
                  <input type="password" className="form-control mt-3" placeholder="Confirm Password" {...formik.getFieldProps('confirm_password')} />
                  {formik.touched.confirm_password && formik.errors.confirm_password ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.confirm_password}</div> : null}
                  <button type="submit" className="btn bg-gradient-primary w-100 my-4 mb-2" disabled={formik.isSubmitting} > {formik.isSubmitting ? 'Loading . . .' : 'Sign up'}</button>
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