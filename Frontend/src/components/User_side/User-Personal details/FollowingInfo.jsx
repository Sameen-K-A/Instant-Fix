import React, { useEffect, useState } from "react";
import { useUserDetails } from "../../../Contexts/UserDetailsContext";
import userAxiosInstance from "../../../config/AxiosInstance/userInstance";
import { Base_URL } from "../../../config/credentials";
import { Delete } from "../../../../public/svgs/Icons";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const FollowingInformation = () => {
  const { userDetails } = useUserDetails();
  const [savedTechnicianDetails, setSavedTechnicianDetails] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    if (userDetails.savedTechnicians.length !== 0) {
      (async () => {
        try {
          const response = await userAxiosInstance.get("/fetchSavedTechnicianDetails", {
            params: { user_id: userDetails.user_id },
          });
          setSavedTechnicianDetails(response.data);
        } catch (error) {
          toast.error("Can't fetch saved technicians informations.")
        };
      })();
    };
  }, []);

  const gotoTechnicianProfile = (technicianDetails) => {
    navigate("/techniciandetails", { state: { details: technicianDetails } });
  };

  return (
    <div className="col-12 col-xl-4 mb-4">
      <div className="card card-body py-2">
        <h6 className="mb-0 mt-3 text-center">Saved Technicians</h6>
        <div className="mt-5 max-height-400" style={{ overflowY: 'auto' }}>
          {savedTechnicianDetails.length !== 0 ? (
            savedTechnicianDetails.map((technician) => {
              return (
                <>
                  <li className="list-group-item border-0 d-flex p-3 mb-1 bg-gray-100 border-radius-lg align-items-center" key={technician} onClick={() => gotoTechnicianProfile(technician.SavedTechnicianPersonalInformation)}>
                    <a className="avatar rounded-circle me-3">
                      <img alt="Image placeholder" src={`${Base_URL}/${technician.SavedTechnicianPersonalInformation.profileIMG}`} />
                    </a>
                    <div className="flex-grow-1 d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-bold text-sm m-0">{technician.SavedTechnicianPersonalInformation.name}</p>
                        <p className="text-xs mt-1 m-0">{technician.SavedTechnicianProfessionInformation.profession}</p>
                      </div>
                      <div className="cursor-pointer">
                        <Delete />
                      </div>
                    </div>
                  </li>
                </>
              );
            })
          ) : (
            <p className="text-center text-xs mb-5 mt-4">
              <strong className="text-sm">No saved technicians</strong>
              <br />
              Your saved technicians field is empty.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowingInformation;