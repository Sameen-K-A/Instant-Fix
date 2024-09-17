import { useFormik } from "formik";
import * as Yup from "yup";
import userAxiosInstance from "../../../Config/AxiosInstance/userInstance";
import { toast } from "sonner";
import { useUserDetails } from "../../../Contexts/UserDetailsContext";
import { useUserAuthContext } from "../../../Contexts/UserAuthContext";

const EditUserInfo = ({ cancelEdit }) => {
  const { userDetails, setUserDetails } = useUserDetails();
  const { setIsLogged } = useUserAuthContext();

  const formik = useFormik({
    initialValues: {
      name: userDetails.name || '',
      phone: userDetails.phone || '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(3, 'Name must be between 3 and 20 characters.')
        .max(20, 'Name must be between 3 and 20 characters.')
        .matches(/^[A-Za-z\s]+$/, 'Name only supports alphabets.')
        .required('Name is required'),
      phone: Yup.string()
        .matches(/^[6-9]\d{9}$/, 'Please enter a valid phone number.')
        .required('Phone number is required')
    }),
    onSubmit: async (values) => {
      const trimmedName = values.name.trim();
      const trimmedPhone = values.phone.trim();
      try {
        await userAxiosInstance.patch("/editprofile", { user_id: userDetails.user_id, name: trimmedName, phone: trimmedPhone });
        const updatedDetails = { ...userDetails, name: trimmedName, phone: trimmedPhone };
        setUserDetails(updatedDetails);
        cancelEdit();
        toast.success("Profile updated successfully");
        localStorage.setItem("userDetails", JSON.stringify(updatedDetails));
      } catch (error) {
        if (error.response?.status === 301) {
          toast.warning("No changes found.");
        } else if (error.response?.status === 401) {
          setIsLogged(false);
          navigate("/login", { state: { message: "Authorization failed, please login." } });
        } else {
          console.error("Error:", error);
          toast.error("Something went wrong, please try again later.");
        }
      }
    }
  });

  return (
    <li className="list-group-item border-0 p-4 mb-2 mt-3 bg-gray-100 border-radius-lg">
      <form onSubmit={formik.handleSubmit}>
        <input type="text" className="form-control mt-3" placeholder="Name" {...formik.getFieldProps('name')} />
        {formik.touched.name && formik.errors.name ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.name}</div> : null}
        <input type="text" className="form-control mt-3" placeholder="Phone Number" {...formik.getFieldProps('phone')} />
        {formik.touched.phone && formik.errors.phone ? <div className="text-danger text-bold text-xs ps-1 mt-1">{formik.errors.phone}</div> : null}
        <div className="ms-auto mt-3 text-end">
          <button type="button" className="btn text-xs btn-outline-primary border-radius-xl me-1" onClick={cancelEdit}>Cancel</button>
          <button type="submit" className="btn text-xs bg-gradient-primary border-radius-xl">Save</button>
        </div>
      </form>
    </li>
  );
};

export default EditUserInfo;