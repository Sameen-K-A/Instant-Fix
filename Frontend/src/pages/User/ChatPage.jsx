import { useLocation } from "react-router-dom";
import ChatFriends from "../../components/Chat/ChatFriends";
import MsgBtn from "../../components/Chat/MsgBtn";
import RecieverMsg from "../../components/Chat/RecieverMsg";
import SenderMsg from "../../components/Chat/SenderMsg";
import UserNavbar from "../../components/User_side/NavbarPage";
import { useEffect, useState } from "react";
import { Base_URL } from "../../config/credentials";
import userAxiosInstance from "../../config/AxiosInstance/userInstance";
import { toast } from "sonner";

const ChatPage = () => {
  const location = useLocation();
  const [instantChatTechnicianDetails, setInstantChatTechnicianDetails] = useState(null);
  const [previousChattedTechnicians, setPreviousChattedTechnicians] = useState([]);
  // const []

  useEffect(() => {
    setInstantChatTechnicianDetails(location.state?.details);
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    (async () => {
      try {
        const response = await userAxiosInstance.get(`/fetchAlreadyChattedTechnicians?user_id=${userDetails?.user_id}`);
        setPreviousChattedTechnicians(response.data);
      } catch (error) {
        toast.error("Something wrong, can't collection chatting details. Please try again later.")
      }
    })();
  }, []);

  return (
    <>
      <UserNavbar />
      <div className="row m-3" style={{ overflow: 'hidden', minHeight: '88vh' }}>
        <ChatFriends instantChatTechnicianDetails={instantChatTechnicianDetails} previousChattedTechnicians={previousChattedTechnicians} />
        <section className="chat col-lg-9">
          {instantChatTechnicianDetails && (
            <>
              <div className="card p-3 shadow">
                <div className='d-flex align-items-center'>
                  <img src={`${Base_URL}/${instantChatTechnicianDetails?.profileIMG}`} alt="profile_image" width="45px" height="45px" style={{ borderRadius: "50%" }} />
                  <h6 className="ms-2 mt-2">{instantChatTechnicianDetails?.name}</h6>
                </div>
              </div>
              <div className="mt-4 p-3" style={{ overflowY: 'auto', height: 'calc(85vh - 180px)' }}>
                <RecieverMsg />
                <SenderMsg />
                <RecieverMsg />
                <SenderMsg />
                <RecieverMsg />
                <SenderMsg />
              </div>
              <MsgBtn />
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default ChatPage;