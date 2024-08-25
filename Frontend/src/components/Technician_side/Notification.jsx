import React, { useEffect, useState } from "react";
import { useUserDetails } from "../../Contexts/UserDetailsContext";
import { toast } from "sonner";
import userAxiosInstance from "../../config/AxiosInstance/userInstance";

const NotificationCard = () => {
  const { userDetails, setUserDetails } = useUserDetails();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(userDetails?.technicianDetails[0]?.notifications);
  }, [userDetails])

  const clearTechnicianNotification = async () => {
    try {
      await userAxiosInstance.patch("/technician/clearNotification", { technicianUser_id: userDetails?.user_id });
      const afterClearing = { ...userDetails, technicianDetails: [{ ...userDetails.technicianDetails[0], notifications: [] }] };
      setUserDetails(afterClearing);
      sessionStorage.setItem("userDetails", JSON.stringify(afterClearing));
    } catch (error) {
      toast.error("Can't clear the notifications.")
    }
  };

  return (
    <div className="top-0 end-0 me-5 pe-2 pt-1 z-index-3 ps-6 w-100 position-absolute max-width-400">
      <div className="card shadow min-height-400">
        <div className="card-body p-3 card-details">
          <h6 className="card-title mb-0 text-sm">Notification</h6>
          <hr className="horizontal dark m-0 mt-1" />
          {notifications.length === 0 ? (
            <div className="d-flex align-items-center height-100">
              <p className="text-xs text-center w-100 m-0">No older notifications.</p>
            </div>
          ) : (
            <>
              {notifications.map((messages, index) => {
                return (
                  <li key={index + 1} className="list-group-item border-0 p-2 mb-2 mt-2 bg-gray-100 border-radius-lg">
                    <p className="text-xs m-0">{messages}</p>
                  </li>
                );
              })}
              <div className="d-flex justify-content-end" >
                <button className="btn m-0 bg-gradient-primary py-1 px-3" onClick={clearTechnicianNotification}>Clear</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;