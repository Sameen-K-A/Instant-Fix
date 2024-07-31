import { useState } from "react";
import UserChangePassword from "./ChangePassword";
import EditUserInfo from "./EditInfo";
import { Base_URL } from "../../../config/credentials";

const UserInformation = ({ userDetails }) => {
  const [isEdit, setIsEdit] = useState(false);

  const cancelEdit = () => {
    setIsEdit(false);
  };

  const saveChanges = () => {
    setIsEdit(false);
  };

  return (
    <div className="col-12 col-xl-4 mb-4">
      <div className="card col-12 min-height-200">
        <div className="card-header pb-0 p-3">
          <h6 className="mb-0 mt-3 text-center">Personal Information</h6>
        </div>
        <div className="card-body p-3">
          {userDetails && (
            <div className="mt-3">
              {isEdit ? (
                <EditUserInfo userDetails={userDetails} cancelEdit={cancelEdit} saveChanges={saveChanges} />
              ) : (
                <li className="list-group-item border-0 d-flex p-4 mb-2 mt-3 bg-gray-100 border-radius-lg">
                  <div className="d-flex flex-column">
                    <h6 className="mb-3 text-sm">{userDetails?.name}</h6>
                    <span className="mb-2 text-xs text-dark">{userDetails?.email}</span>
                    <span className="mb-2 text-xs text-dark">+91 {userDetails?.phone}</span>
                  </div>
                  <div className="ms-auto text-end">
                    <button className="btn text-xs btn-outline-dark border-radius-xl p-1 px-4 me-1" onClick={() => setIsEdit(true)}>
                      Edit
                    </button>
                  </div>
                </li>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="card col-12 mt-3 min-height-200">
        <div className="card-body p-3">
          <UserChangePassword userDetails={userDetails} />
        </div>
      </div>
    </div>
  );
};

export default UserInformation;