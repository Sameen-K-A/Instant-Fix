import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Base_URL } from '../../config/credentials';
import backgroundImage from '/images/Login&RegisterBackground.jpg';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
    }),
    onSubmit: async (values) => {
      const { email, password } = values;
      try {
        const response = await axios.post(`${Base_URL}/admin/login`, { email, password });
        sessionStorage.setItem('adminToken', response.data);
        navigate('/admin/dashboard');
      } catch (error) {
        if (error.response.data.message === 'Email not found') {
          toast.error('Email not found');
        } else if (error.response.data.message === 'Password is wrong') {
          toast.error('Password is wrong');
        } else {
          toast.error('Something went wrong, please try again later');
        }
      }
    }
  });

  useEffect(() => {
    if (location.state?.message === 'Authorization failed please login') {
      toast.error('Authorization failed please login.');
    } else if (location.state?.message === 'Logout successfully') {
      toast.success(location.state?.message);
    }
  }, [location.state]);

  return (
    <>
      <div className="page-header min-vh-75">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
              <div className="card card-plain mt-8">
                <div className="card-header pb-0 text-left bg-transparent">
                  <h3 className="font-weight-bolder text-info text-gradient">Hello Admin</h3>
                  <p className="mb-0">Enter your email and password to sign in.</p>
                </div>
                <div className="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <label>Email</label>
                    <input type="text" className="form-control" placeholder="Email" {...formik.getFieldProps('email')} />
                    {formik.touched.email && formik.errors.email ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.email}</div> : null}
                    <label className='mt-3'>Password</label>
                    <input type="password" className="form-control" placeholder="Password" {...formik.getFieldProps('password')} />
                    {formik.touched.password && formik.errors.password ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.password}</div> : null}
                    <button type="submit" className="btn bg-gradient-info w-100 mt-4 mb-0 text-center" disabled={formik.isSubmitting} >{formik.isSubmitting ? 'Signing in...' : 'Sign in'}</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="oblique position-absolute top-0 h-100 d-md-block d-none me-n8">
                <div className="oblique-image bg-cover position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6" style={{ backgroundImage: `url(${backgroundImage})` }} >
                  <span className="mask bg-gradient-primary opacity-8"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;