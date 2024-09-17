import React, { useEffect, useState } from "react";
import { useUserDetails } from "../../../Contexts/UserDetailsContext";
import userAxiosInstance from "../../../Config/AxiosInstance/userInstance";
import { Delete } from "../../../../public/svgs/Icons";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const FollowingInformation = () => {
  const { userDetails, setUserDetails } = useUserDetails();
  const [savedTechnicianDetails, setSavedTechnicianDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails.savedTechnicians.length !== 0) {
      (async () => {
        try {
          const response = await userAxiosInstance.get("/fetchSavedTechnicianDetails", { params: { user_id: userDetails.user_id }, });
          setSavedTechnicianDetails(response.data);
        } catch (error) {
          toast.error("Can't fetch saved technicians information.");
        };
      })();
    };
  }, [userDetails.user_id]);

  const gotoTechnicianProfile = (technicianDetails) => {
    navigate("/techniciandetails", { state: { details: technicianDetails } });
  };

  const unSaveTechnician = async (technicianUser_id) => {
    try {
      await userAxiosInstance.patch("/unSaveTechnician", { technicianId: technicianUser_id, user_id: userDetails.user_id, });
      const updatedUnSavedTechniciansID = userDetails.savedTechnicians.filter((technician_id) => technician_id !== technicianUser_id);
      const afterUnSaveComplete = { ...userDetails, savedTechnicians: updatedUnSavedTechniciansID, };
      localStorage.setItem("userDetails", JSON.stringify(afterUnSaveComplete));
      setUserDetails(afterUnSaveComplete);
      const updatedUnSavedTechniciansInformation = savedTechnicianDetails.filter((technicianInfo) => technicianInfo.SavedTechnicianPersonalInformation.user_id !== technicianUser_id);
      setSavedTechnicianDetails(updatedUnSavedTechniciansInformation);
    } catch (error) {
      toast.error("Can't unsave technician. Please try again later.");
    };
  };

  return (
    <div className="col-12 col-xl-4 mb-4">
      <div className="card card-body py-2">
        <h6 className="mb-5 mt-3 text-center">Saved Technicians</h6>
        <div className="max-height-400" style={{ overflowY: "auto" }}>
          {savedTechnicianDetails.length !== 0 ? (
            savedTechnicianDetails.map((technician) => (
              <li className="list-group-item border-0 d-flex mb-1 bg-gray-100 border-radius-lg align-items-center" key={technician.SavedTechnicianPersonalInformation.user_id} >
                <a className="avatar rounded-circle me-3" onClick={() => gotoTechnicianProfile(technician.SavedTechnicianPersonalInformation)}>
                  <img alt="Image placeholder" src={`${technician.SavedTechnicianPersonalInformation.profileIMG}`} />
                </a>
                <div className="flex-grow-1 d-flex justify-content-between align-items-center">
                  <div className="flex-column">
                    <p className="text-bold text-sm m-0">{technician.SavedTechnicianPersonalInformation.name}</p>
                    <p className="text-xs mt-1 m-0">{technician.SavedTechnicianProfessionInformation.profession}</p>
                  </div>
                  <div className="cursor-pointer" onClick={() => unSaveTechnician(technician.SavedTechnicianPersonalInformation.user_id)} ><Delete /></div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-xs mb-7 mt-5">
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