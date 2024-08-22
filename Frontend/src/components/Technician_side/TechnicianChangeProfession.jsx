import { useState } from "react";
import { toast } from "sonner";
import confirmAlert from "../Common/SweetAlert/confirmAlert";
import userAxiosInstance from "../../config/AxiosInstance/userInstance";

const TechnicianChangeProfession = ({ profession, userDetails, setUserDetails }) => {

  const [isEdit, setIsEdit] = useState(false);
  const professions = ["Painter", "Welder", "Electrician", "Plumber", "Automobile Mechanic", "AC Mechanic", "Other"];
  const [selectedProfessionIndex, setSelectedProfessionIndex] = useState(null);
  const [enteredOtherProfession, setEnteredOtherProfession] = useState("");

  const handleSave = () => {
    if (selectedProfessionIndex === null) {
      toast.warning("Choose your correct profession.");
      return;
    }
    let finalProfession = professions[selectedProfessionIndex];
    if (finalProfession === "Other") {
      const professionRegex = /^[A-Za-z\s]+$/;
      if (enteredOtherProfession.trim().length < 3 || enteredOtherProfession.trim().length > 20) {
        toast.warning("Profession must be between 3 and 20 characters.");
        return;
      } else if (!professionRegex.test(enteredOtherProfession)) {
        toast.warning("Profession only supports alphabets.");
        return;
      } else {
        finalProfession = enteredOtherProfession;
      }
    }
    confirmAlert("Save your professions?")
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await userAxiosInstance.patch(`/technician/changeprofession`, { user_id: userDetails.user_id, profession: finalProfession });
            toast.success("Changes commit successfully");
            const afterChanging = { ...userDetails, technicianDetails: [{ ...userDetails.technicianDetails[0], profession: finalProfession }] };
            sessionStorage.setItem("userDetails", JSON.stringify(afterChanging));
            setUserDetails(afterChanging);
            setIsEdit(false);
          } catch (error) {
            if (error.response.status === 401) {
              navigate("/login", { state: { message: "Authorization failed please login" } });
            } else if (error.response.status === 304) {
              toast.warning("No changes found");
              setIsEdit(false);
            } else {
              console.log(error);
              toast.warning("Something wrong please try again later");
            }
          }
        }
      });
  };

  return (
    <div className="card min-height-200 mb-3">
      <div className="card-header pb-0 p-3">
        <h6 className="mb-0 mt-3 text-center">Change Profession</h6>
      </div>
      <div className="card-body p-3">
        <div className="mt-3">
          <li className="list-group-item border-0 d-flex p-4 mb-0 mt-3 bg-gray-100 border-radius-lg">
            {!isEdit ? (
              <>
                <div className="d-flex flex-column pt-2">
                  <h6 className="text-sm">{profession}</h6>
                </div>
                <div className="ms-auto text-end mt-1">
                  <button className="btn text-xs btn-outline-primary border-radius-xl mb-0 p-1 px-4" onClick={() => setIsEdit(true)}>Change</button>
                </div>
              </>
            ) : (
              <div className="w-100">
                <p className='text-start text-sm text-bold'>Choose your correct Profession</p>
                <br />
                {professions.map((prof, index) => (
                  <p key={index} className='text-start text-sm border-radius-md mb-1 p-1 px-3 cursor-pointer' style={{ backgroundColor: index === selectedProfessionIndex ? "#FBECEC" : "#f2f2f2" }}
                    onClick={() => setSelectedProfessionIndex(index)}
                  >{prof}</p>
                ))}
                {professions[selectedProfessionIndex] === "Other" && (
                  <input type="text" className='form-control mt-4' placeholder="Enter your profession" onChange={(e) => setEnteredOtherProfession(e.target.value)} />
                )}
                <div className="ms-auto mt-3 text-end">
                  <button className="btn text-xs btn-outline-primary border-radius-xl mb-0 me-2" onClick={() => setIsEdit(false)}>Cancel</button>
                  <button className="btn text-xs bg-gradient-primary border-radius-xl mb-0" onClick={() => handleSave()}>Save</button>
                </div>
              </div>
            )}
          </li>
        </div>
      </div>
    </div>
  );

};

export default TechnicianChangeProfession;