import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import userAxiosInstance from '../../../config/AxiosInstance/userInstance';
import { useNavigate } from 'react-router-dom';

const EditAddressModal = ({ changingAddress, userAddress, setUserAddress }) => {
  const navigate = useNavigate();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      address_id: '',
      name: '',
      address: '',
      pinCode: '',
      phoneNumber: '',
      alternateNumber: ''
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(4, 'Name must be between 4 and 20 characters')
        .max(20, 'Name must be between 4 and 20 characters')
        .required('Name is required'),
      address: Yup.string()
        .trim()
        .min(4, 'Address must be more than 3 characters')
        .required('Address is required'),
      pinCode: Yup.string()
        .matches(/^6\d{5}$/, 'Enter a valid pincode')
        .required('PIN code is required'),
      phoneNumber: Yup.string()
        .matches(/^[6-9]\d{9}$/, 'Enter a valid phone number')
        .required('Phone number is required'),
      alternateNumber: Yup.string()
        .matches(/^[6-9]\d{9}$/, 'Enter a valid alternate number')
        .required('Alternate number is required')
        .notOneOf([Yup.ref('phoneNumber')], 'Primary and alternate numbers must be different')
    }),
    onSubmit: async (values) => {
      try {
        const { address_id, name, address, pinCode, phoneNumber, alternateNumber } = values;
        await userAxiosInstance.put(`/address`, {
          address_id,
          name,
          address,
          pincode: pinCode,
          phone: phoneNumber,
          alternatePhone: alternateNumber
        });

        const updatedAddresses = userAddress.map((addr) =>
          addr.address_id === address_id
            ? { ...addr, name, address, pincode: pinCode, phone: phoneNumber, alternatePhone: alternateNumber }
            : addr
        );
        setUserAddress(updatedAddresses);
        sessionStorage.setItem("AddressList", JSON.stringify(updatedAddresses));
        toast.success("Address updated successfully!");

        // Close the modal
        const modal = document.getElementById('editAddressModal');
        const backdrop = document.querySelector('.modal-backdrop');
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
        if (backdrop) backdrop.remove();
        document.body.classList.remove('modal-open');
        document.body.style = '';

      } catch (error) {
        if (error.response?.status === 304) {
          toast.warning("No changes found.");
        } else if (error.response?.status === 401) {
          navigate("/login", { state: { message: "Authorization failed, please login." } });
        } else {
          console.error("Error:", error);
          toast.error("Something went wrong, please try again later.");
        }
      }
    }
  });

  useEffect(() => {
    if (changingAddress) {
      formik.setValues({
        address_id: changingAddress.address_id,
        name: changingAddress.name,
        address: changingAddress.address,
        pinCode: changingAddress.pincode,
        phoneNumber: changingAddress.phone,
        alternateNumber: changingAddress.alternatePhone
      });
    }
  }, [changingAddress]);

  return (
    <div className="modal fade" id="editAddressModal" tabIndex="-1" aria-labelledby="editAddressModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body p-4 pt-5">
            <h5 className="modal-title" id="editAddressModalLabel">Edit address</h5>
            <form className='my-4' onSubmit={formik.handleSubmit}>
              <input type="text" className="form-control mb-3" placeholder="Name" {...formik.getFieldProps('name')} />
              {formik.touched.name && formik.errors.name ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.name}</div> : null}
              <textarea className="form-control mb-3" placeholder="House name, House/ Flat number, District" style={{ minHeight: "50px", maxHeight: "150px" }} {...formik.getFieldProps('address')} />
              {formik.touched.address && formik.errors.address ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.address}</div> : null}
              <input type="text" className="form-control mb-3" placeholder="PIN Code" {...formik.getFieldProps('pinCode')} />
              {formik.touched.pinCode && formik.errors.pinCode ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.pinCode}</div> : null}
              <div className='d-flex justify-content-between'>
                <div className='w-100 me-1'>
                  <input type="text" className="form-control me-2" placeholder="Phone number" {...formik.getFieldProps('phoneNumber')} />
                  {formik.touched.phoneNumber && formik.errors.phoneNumber ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.phoneNumber}</div> : null}
                </div>
                <div className='w-100 ms-1'><input type="text" className="form-control" placeholder="Alternate number" {...formik.getFieldProps('alternateNumber')} />
                  {formik.touched.alternateNumber && formik.errors.alternateNumber ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.alternateNumber}</div> : null}
                </div>
              </div>
              <div className='d-flex justify-content-center align-items-center mt-4'>
                <button type="button" className="btn btn-outline-primary w-30 me-3 my-0" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn bg-gradient-primary w-30 my-0" disabled={formik.isSubmitting}>{formik.isSubmitting ? 'Saving...' : 'Change'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditAddressModal;