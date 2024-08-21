import { useState } from "react";
import EditUserInfo from "./EditInfo";

const UserInformation = ({ userDetails, setUserDetails }) => {
  const [isEdit, setIsEdit] = useState(false);

  const cancelEdit = () => {
    setIsEdit(false);
  };

  return (
    <div className="card col-12 min-height-200">
      <div className="card-header pb-0 p-3">
        <h6 className="mb-0 mt-3 text-center">Personal Information</h6>
      </div>
      <div className="card-body p-3">
        {userDetails && (
          <div className="mt-3">
            {isEdit ? (
              <EditUserInfo userDetails={userDetails} setUserDetails={setUserDetails} cancelEdit={cancelEdit} />
            ) : (
              <li className="list-group-item border-0 d-flex p-4 mb-2 mt-3 bg-gray-100 border-radius-lg">
                <div className="d-flex flex-column">
                  <h6 className="mb-3 text-sm">{userDetails?.name}</h6>
                  <span className="mb-2 text-xs text-dark">{userDetails?.email}</span>
                  <span className="mb-2 text-xs text-dark">+91 {userDetails?.phone}</span>
                </div>
                <div className="ms-auto text-end mb-0">
                  <button className="btn text-xs btn-outline-primary border-radius-xl p-1 px-4 me-1" onClick={() => setIsEdit(true)}>
                    Edit
                  </button>
                </div>
              </li>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInformation;