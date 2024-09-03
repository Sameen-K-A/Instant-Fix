import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import userAxiosInstance from '../../../config/axiosInstance/userInstance';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import confirmAlert from '../../Common/SweetAlert/confirmAlert';
import { useUserDetails } from '../../../Contexts/UserDetailsContext';

const UserChangePassword = () => {
  const { userDetails } = useUserDetails();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      currentPass: '',
      newPass: ''
    },
    validationSchema: Yup.object({
      currentPass: Yup.string()
        .trim()
        .required('Current password is required'),
      newPass: Yup.string()
        .trim()
        .min(8, 'New password must be at least 8 characters long')
        .required('New password is required')
    }),

    onSubmit: async (values) => {
      const { currentPass, newPass } = values;
      confirmAlert("Change your password?")
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              await userAxiosInstance.patch('/changepassword', { currentPass, newPass, user_id: userDetails?.user_id });
              toast.success('Password changed successfully.');
              formik.resetForm();
            } catch (error) {
              if (error.response?.data?.message === 'Current password is wrong') {
                toast.error('Current password is wrong.');
              } else if (error.response.status === 401) {
                navigate('/login', { state: { message: 'Authorization failed please login' } });
              } else {
                console.log(error);
                toast.warning('Something went wrong, please try again later.');
              }
            }
          }
        });
    }
  });

  return (
    <div className="card col-12 mt-3 min-height-200">
      <div className="card-body p-3">
        <div className="card-header pb-0 p-3">
          <h6 className="mb-0 mt-3 text-center">Change password</h6>
        </div>
        <li className="list-group-item border-0 p-4 mb-0 mt-3 bg-gray-100 border-radius-lg">
          <input type="password" className="form-control mt-1" placeholder="Enter current password" {...formik.getFieldProps('currentPass')} />
          {formik.touched.currentPass && formik.errors.currentPass ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.currentPass}</div> : null}
          <input type="password" className="form-control mt-3" placeholder="Enter new password" {...formik.getFieldProps('newPass')} />
          {formik.touched.newPass && formik.errors.newPass ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.newPass}</div> : null}
          <div className="ms-auto mt-3 text-end">
            <button type="button" className="btn text-xs bg-gradient-primary border-radius-xl mb-0" onClick={() => formik.handleSubmit()} disabled={formik.isSubmitting} >{formik.isSubmitting ? 'Saving...' : 'Save'}</button>
          </div>
        </li>
      </div>
    </div>
  );
}

export default UserChangePassword;