import { useEffect, useState } from "react";
import userAxiosInstance from "../../../config/AxiosInstance/userInstance";
import { useNavigate } from "react-router-dom";
import confirmAlert from "../../Common/SweetAlert/confirmAlert";
import { toast } from "sonner";
import AddressModal from "./AddressModal";
import EditAddressModal from "./EditAddressModal";

const AddressInformation = () => {
  const [userAddress, setUserAddress] = useState([]);
  const [selectedEditAddress, setSelectedEditAddress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    const user_id = userDetails?.user_id;
    (async () => {
      try {
        const response = await userAxiosInstance.get(`/address?user_id=${user_id}`);
        setUserAddress(response.data);
      } catch (error) {
        if (error.response.status === 401) {
          navigate("/login", { state: { message: "Authorization failed please login" } });
        } else {
          console.log(error);
          toast.warning("Something wrong please try again later");
        }
      }
    })();
  }, []);

  const handleDelete = (address_id) => {
    confirmAlert("Do you want to delete this Address")
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await userAxiosInstance.delete(`/address?address_id=${address_id}`);
            const afterDeletedAddressArray = userAddress.filter((address) => address.address_id !== address_id);
            setUserAddress(afterDeletedAddressArray);
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
    <div className="col-12 col-xl-4 mb-4">
      <div className="card min-height-200">
        <div className="card-header pb-0 p-3">
          <h6 className="mb-0 mt-3 text-center">Address Details</h6>
        </div>
        <div className="card-body p-3">
          {!userAddress.length ? (
            <p className="text-center text-xs mb-5 mt-4">
              <strong className='text-sm'>Address not found</strong><br /> please add new Address
            </p>
          ) : (
            userAddress.map((address, index) => (
              <li key={address?.address_id} className="list-group-item border-0 d-flex p-4 mb-2 mt-3 bg-gray-100 border-radius-lg">
                <div className="d-flex flex-column">
                  <h6 className="mb-3 text-sm">Address {index + 1}</h6>
                  <span className="mb-2 text-xs text-dark">{address?.name},</span>
                  <span className="mb-2 text-xs text-dark">{address?.address}</span>
                  <span className="mb-2 text-xs text-dark">{address?.pincode}</span>
                  <span className="mb-2 text-xs text-dark">{address?.phone}, <span className='mx-2'>{address?.alternatePhone}</span></span>
                </div>
                <div className="ms-auto text-end">
                  <button className="btn text-xs btn-outline-dark border-radius-xl p-1 px-4 me-1" data-bs-toggle="modal" data-bs-target="#editAddressModal" onClick={() => setSelectedEditAddress(address)}>
                    Edit
                  </button>
                  <button className="btn text-xs bg-gradient-danger border-radius-xl p-1 px-3" onClick={() => handleDelete(address?.address_id)}>Delete</button>
                </div>
              </li>
            ))
          )}
          {userAddress.length < 2 && (
            <div className="d-flex justify-content-center">
              <button className="btn bg-gradient-primary border-radius-xl w-50" data-bs-toggle="modal" data-bs-target="#addressModal">Add Address</button>
            </div>
          )}
        </div>
      </div>
      <EditAddressModal changingAddress={selectedEditAddress} userAddress={userAddress} setUserAddress={setUserAddress} />
      <AddressModal userAddress={userAddress} setUserAddress={setUserAddress} />
    </div>
  );
};

export default AddressInformation;