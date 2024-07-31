import { useState } from "react";
import userAxiosInstance from "../../../config/AxiosInstance/userInstance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import confirmAlert from "../../Common/SweetAlert/confirmAlert";

const UserChangePassword = ({ userDetails }) => {

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const navigate = useNavigate();

  const handleChange = () => {
    if (!currentPass.trim().length || !newPass.trim().length) {
      toast.warning("All fields are required.");
      return;
    }
    if (newPass.length < 8) {
      toast.warning("New password must be at least 8 characters long.");
      return;
    }
    confirmAlert("Change your password?")
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await userAxiosInstance.patch("/changepassword", { currentPass, newPass, user_id: userDetails?.user_id });
            toast.success("Password changed successfully.");
            setCurrentPass("");
            setNewPass("");
          } catch (error) {
            if (error.response?.data?.message === "Current password is wrong") {
              toast.error("Current password is wrong.");
            } else if (error.response.status === 401) {
              navigate("/login", { state: { message: "Authorization failed please login" } });
            } else {
              console.log(error);
              toast.warning("Something wrong please try again later");
            }
          }
        }
      })
  };

  return (
    <>
      <div className="card-header pb-0 p-3">
        <h6 className="mb-0 mt-3 text-center">Change password</h6>
      </div>
      <li className="list-group-item border-0 p-4 mb-0 mt-3 bg-gray-100 border-radius-lg">
        <input type="text" className="form-control mt-1" placeholder="Enter current password" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} />
        <input type="text" className="form-control mt-3" placeholder="Enter new password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
        <div className="ms-auto mt-3 text-end">
          <button className="btn text-xs bg-gradient-primary border-radius-xl" onClick={() => handleChange()}>Save</button>
        </div>
      </li>
    </>
  )
}

export default UserChangePassword;