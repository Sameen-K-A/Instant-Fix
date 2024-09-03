import { Fragment } from "react";
import { Base_URL } from "../../config/credentials"; 

const ChatFriends = ({ instantChatTechnicianDetails, previousChattedTechnicians, setCurrentChatting }) => {

  return (
    <section className="col-lg-3 mb-3 min-height-600 card shadow">
      <h6 className="ps-3 pt-3">Chats</h6>
      <hr className="horizontal dark mt-0" />

      {instantChatTechnicianDetails && (
        <Fragment>
          <div className="d-flex align-items-center cursor-pointer py-4" onClick={() => {
            setCurrentChatting({
              user_id: instantChatTechnicianDetails?.user_id,
              name: instantChatTechnicianDetails?.name,
              profileIMG: instantChatTechnicianDetails?.profileIMG
            })
          }}>
            <img src={`${Base_URL}/${instantChatTechnicianDetails?.profileIMG}`} alt="profile_image" className="ms-4" width={"45px"} height={"45px"} style={{ borderRadius: "50%" }} />
            <div className="ms-3">
              <h6 className="mt-2 text-sm">{instantChatTechnicianDetails?.name}</h6>
            </div>
          </div>
          <hr className="horizontal dark m-0" />
        </Fragment>
      )}

      {previousChattedTechnicians.length > 0 && (
        <>
          {previousChattedTechnicians.map((technician) => (
            technician?.technicianPersonalDetails?.user_id !== instantChatTechnicianDetails?.user_id && (
              <Fragment key={technician?.technicianPersonalDetails?.user_id}>
                <div className="d-flex align-items-center cursor-pointer py-4 " onClick={() => {
                  setCurrentChatting({
                    user_id: technician?.technicianPersonalDetails?.user_id,
                    name: technician?.technicianPersonalDetails?.name,
                    profileIMG: technician?.technicianPersonalDetails?.profileIMG
                  })
                }}>
                  <img src={`${Base_URL}/${technician?.technicianPersonalDetails?.profileIMG}`} alt="profile_image" className="ms-4" width={"45px"} height={"45px"} style={{ borderRadius: "50%" }} />
                  <div>
                    <h6 className="ms-3 mt-2 text-sm">{technician?.technicianPersonalDetails?.name}</h6>
                  </div>
                </div>
                <hr className="horizontal dark m-0" />
              </Fragment>
            )
          ))}
        </>
      )}

      {!instantChatTechnicianDetails && previousChattedTechnicians.length === 0 && (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
          <h6 className="text-black-50 text-xs">No recent contacts found.</h6>
        </div>
      )}
    </section>
  );
};

export default ChatFriends;