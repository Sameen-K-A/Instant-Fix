import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import userAxiosInstance from '../../../config/axiosInstance/userInstance';
import { useNavigate } from 'react-router-dom';
import { useUserDetails } from '../../../Contexts/UserDetailsContext'; 

const AddressModal = () => {
  const navigate = useNavigate();
  const districtArray = ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"];
  const [openDistrictSession, setOpenDistrictSession] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [defaultDistrict, setDefaultDistrict] = useState(districtArray[1]);
  const { userDetails, setUserDetails } = useUserDetails();

  useEffect(() => {
    if (userDetails?.addressDetails?.district) {
      setDefaultDistrict(userDetails.addressDetails.district);
    }
  }, [userDetails]);

  const formik = useFormik({
    initialValues: {
      name: userDetails?.addressDetails?.name || '',
      address: userDetails?.addressDetails?.address || '',
      pinCode: userDetails?.addressDetails?.pincode || '',
      phoneNumber: userDetails?.addressDetails?.phone || '',
      alternateNumber: userDetails?.addressDetails?.alternatePhone || ''
    },
    enableReinitialize: true,
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
      setIsloading(true);
      try {
        const addAndEditAddressDetails = {
          name: values.name,
          address: values.address,
          district: defaultDistrict,
          state: "Kerala",
          pincode: values.pinCode,
          phone: values.phoneNumber,
          alternatePhone: values.alternateNumber
        }
        await userAxiosInstance.patch(`/address`, { addAndEditAddressDetails, user_id: userDetails.user_id });

        // Close the modal
        const modal = document.getElementById('addressModal');
        const backdrop = document.querySelector('.modal-backdrop');
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
        if (backdrop) backdrop.remove();
        document.body.classList.remove('modal-open');
        document.body.style = '';

        const afterChanging = { ...userDetails, addressDetails: addAndEditAddressDetails };
        sessionStorage.setItem("userDetails", JSON.stringify(afterChanging));
        setUserDetails(afterChanging);
        toast.success("The address has been added successfully.");
        formik.resetForm();
        setIsloading(false);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login", { state: { message: "Authorization failed please login" } });
        } else {
          console.log(error);
          toast.warning("Something went wrong, please try again later");
        }
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
        setIsloading(false);
      }
    }
  });

  return (
    <div className="modal fade" id="addressModal" tabIndex="-1" aria-labelledby="addressModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body p-4 pt-5">
            <h5 className="modal-title text-center" id="addressModalLabel">{userDetails?.addressDetails ? "Edit Address" : "Add Address"}</h5>
            <form className='my-4' onSubmit={formik.handleSubmit}>

              <input type="text" className="form-control" placeholder="Name" {...formik.getFieldProps('name')} />
              {formik.touched.name && formik.errors.name ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.name}</div> : null}

              <textarea className="form-control mt-3" placeholder="House name, House/ Flat number" style={{ minHeight: "50px", maxHeight: "150px" }} {...formik.getFieldProps('address')} />
              {formik.touched.address && formik.errors.address ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.address}</div> : null}

              <input type="text" className="form-control mt-3" placeholder="PIN Code" {...formik.getFieldProps('pinCode')} />
              {formik.touched.pinCode && formik.errors.pinCode ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.pinCode}</div> : null}

              <div className='d-flex justify-content-between'>
                <div className='w-100 me-1'>
                  <input type="text" className="form-control mt-3" readOnly value={"Kerala"} />
                </div>
                <div className='w-100 ms-1'>
                  {openDistrictSession ? (
                    <div className='border rounded-3 mt-3 max-height-100' style={{ overflowY: 'auto' }}>
                      {districtArray.map((dist, index) => (
                        <p key={index} className='text-start text-sm border-radius-md mb-1 p-1 px-3 cursor-pointer'
                          onClick={() => { setDefaultDistrict(dist); setOpenDistrictSession(false); }}
                        >{dist}</p>
                      ))}
                    </div>
                  ) : (
                    <div className='form-control mt-3 cursor-pointer' onClick={() => setOpenDistrictSession(true)}>{defaultDistrict}</div>
                  )}
                </div>
              </div>

              <div className='d-flex justify-content-between'>
                <div className='w-100 me-1'>
                  <input type="text" className="form-control mt-3" placeholder="Phone number" {...formik.getFieldProps('phoneNumber')} />
                  {formik.touched.phoneNumber && formik.errors.phoneNumber ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.phoneNumber}</div> : null}
                </div>
                <div className='w-100 ms-1'>
                  <input type="text" className="form-control mt-3" placeholder="Alternate number" {...formik.getFieldProps('alternateNumber')} />
                  {formik.touched.alternateNumber && formik.errors.alternateNumber ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.alternateNumber}</div> : null}
                </div>
              </div>

              <div className='d-flex justify-content-center align-items-center mt-4'>
                <button type="button" className="btn btn-outline-primary w-30 me-3 my-0" data-bs-dismiss="modal">Cancel</button>
                {isLoading ? (
                  <button type="button" className="btn bg-gradient-primary w-30 my-0">Please wait . . .</button>
                ) : (
                  <button type="submit" className="btn bg-gradient-primary w-30 my-0">Save</button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div >
    </div >
  );
};

export default AddressModal;