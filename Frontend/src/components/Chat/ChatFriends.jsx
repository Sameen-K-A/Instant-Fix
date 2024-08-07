import { Fragment } from "react";
import { Base_URL } from "../../config/credentials";

const ChatFriends = ({ instantChatTechnicianDetails, previousChattedTechnicians, setCurrentChatting }) => {
  return (
    <section className="col-lg-3 mb-3 min-height-600 card shadow">
      <h6 className="ps-3 pt-3">Chats</h6>
      <hr className="horizontal dark mt-0" />

      {instantChatTechnicianDetails && (
        <Fragment>
          <div className="d-flex align-items-center cursor-pointer py-4" onClick={() => { setCurrentChatting(instantChatTechnicianDetails) }}>
            <img src={`${Base_URL}/${instantChatTechnicianDetails?.profileIMG}`} alt="profile_image" className="ms-4" width={"45px"} height={"45px"} style={{ borderRadius: "50%" }} />
            <div className="ms-3">
              <h6 className="mt-1 text-sm">{instantChatTechnicianDetails?.name}</h6>
              <p className="text-xs text-thin mb-0">
                {instantChatTechnicianDetails?.technicianDetails[0]?.profession}
              </p>
            </div>
          </div>
          <hr className="horizontal dark m-0" />
        </Fragment>
      )}

      {previousChattedTechnicians.length > 0 && (
        <>
          {previousChattedTechnicians.map((technician) => (
            technician.user_id !== instantChatTechnicianDetails?.user_id && (
              <Fragment key={technician?.user_id}>
                <div className="d-flex align-items-center cursor-pointer py-4 " onClick={() => setCurrentChatting(technician)}>
                  <img src={`${Base_URL}/${technician?.profileIMG}`} alt="profile_image" className="ms-4" width={"45px"} height={"45px"} style={{ borderRadius: "50%" }} />
                  <div>
                    <h6 className="ms-3 mt-1 text-sm">{technician?.name}</h6>
                    <p className="text-xs ms-3 text-thin mb-0">
                      {technician?.profession}
                    </p>
                  </div>
                </div>
                <hr className="horizontal dark m-0" />
              </Fragment>
            )
          ))}
        </>
      )}

      {!instantChatTechnicianDetails && previousChattedTechnicians.length === 0 && (
        <p className="text-center">Not found</p>
      )}
    </section>
  );
};

export default ChatFriends;