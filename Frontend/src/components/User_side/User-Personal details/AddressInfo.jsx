import userAxiosInstance from "../../../config/AxiosInstance/userInstance";
import confirmAlert from "../../Common/SweetAlert/confirmAlert";
import { toast } from "sonner";
import AlertRedDot from "../../Common/AlertRedDot";
import AddressModal from "./AddressModal";

const AddressInformation = ({ userDetails, setUserDetails }) => {

  const handleDelete = () => {
    confirmAlert("Do you want to delete this Address")
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await userAxiosInstance.delete(`/address?user_id=${userDetails.user_id}`);
            const afterDeletedAddressArray = { ...userDetails, addressDetails: null };
            setUserDetails(afterDeletedAddressArray);
            sessionStorage.setItem("userDetails", JSON.stringify(afterDeletedAddressArray));
            toast.success("The address has been deleted successfully.");
          } catch (error) {
            if (error.response.status === 401) {
              navigate("/login", { state: { message: "Authorization failed please login" } });
            } else {
              console.log(error);
              toast.warning("Something wrong please try again later");
            }
          }
        }
      });
  };

  return (
    <>
      <div className="card min-height-200">
        <div className="card-header pb-0 p-3 d-flex align-items-center justify-content-center">
          <h6 className="mb-0 mt-3 text-center">Address Details</h6>
          {!userDetails?.addressDetails && <AlertRedDot />}
        </div>
        <div className="card-body p-3">
          {!userDetails?.addressDetails ? (
            <p className="text-center text-xs mb-5 mt-4">
              <strong className='text-sm'>Address not found</strong><br /> please add new Address
            </p>
          ) : (
            <li className="list-group-item border-0 d-flex p-4 mb-2 mt-3 bg-gray-100 border-radius-lg">
              <div className="d-flex flex-column">
                <span className="mb-2 text-xs text-dark">{userDetails?.addressDetails?.name},</span>
                <span className="mb-2 text-xs text-dark">{userDetails?.addressDetails?.address}</span>
                <span className="mb-2 text-xs text-dark">{userDetails?.addressDetails?.district}, <span className='mx-2'>{userDetails?.addressDetails?.state}</span></span>
                <span className="mb-2 text-xs text-dark">{userDetails?.addressDetails?.pincode}</span>
                <span className="mb-2 text-xs text-dark">{userDetails?.addressDetails?.phone}, <span className='mx-2'>{userDetails?.addressDetails?.alternatePhone}</span></span>
              </div>
              <div className="ms-auto text-end">
                <button className="btn text-xs btn-outline-primary p-1 px-4 me-1" data-bs-toggle="modal" data-bs-target="#addressModal"> Edit</button>
                <button className="btn text-xs bg-gradient-danger border-radius-xl p-1 px-3" onClick={() => handleDelete()}>Delete</button>
              </div>
            </li>
          )}
          {!userDetails?.addressDetails && (
            <div className="d-flex justify-content-center">
              <button className="btn bg-gradient-primary border-radius-xl w-50" data-bs-toggle="modal" data-bs-target="#addressModal">Add Address</button>
            </div>
          )}
        </div>
      </div>
      <AddressModal userDetails={userDetails} setUserDetails={setUserDetails} />
    </>
  );
};

export default AddressInformation;