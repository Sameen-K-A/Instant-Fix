import { useLocation } from "react-router-dom";
import ChatFriends from "../../components/Chat/ChatFriends";
import UserNavbar from "../../components/User_side/NavbarPage";
import { useEffect, useState } from "react";
import userAxiosInstance from "../../config/AxiosInstance/userInstance";
import { toast } from "sonner";
import ChatScreen from "../../components/Chat/ChatScreen";
import TechnicianNavbar from "../../components/Technician_side/NavbarPage";

const ChatPage = () => {

  const location = useLocation();
  const [instantChatTechnicianDetails, setInstantChatTechnicianDetails] = useState(null);
  const [previousChattedTechnicians, setPreviousChattedTechnicians] = useState([]);
  const [currentChatting, setCurrentChatting] = useState(null);

  useEffect(() => {
    setInstantChatTechnicianDetails(location.state?.details);
    setCurrentChatting(location.state?.details);
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
      {location.pathname === "/technician/chat" ? <TechnicianNavbar /> : <UserNavbar />}
      <div className="row m-3 me-6" style={{ overflow: 'hidden', minHeight: '88vh' }}>
        <ChatFriends instantChatTechnicianDetails={instantChatTechnicianDetails} previousChattedTechnicians={previousChattedTechnicians} setCurrentChatting={setCurrentChatting} />
        <section className="chat col-lg-9">
          {currentChatting ? (
            <ChatScreen currentChatting={currentChatting} />
          ) : (
            <div className="d-flex justify-content-center align-items-center flex-column text-center" style={{ height: '100%' }}>
              <h6 className="text-black-50">Welcome to Instant-Fix Chat</h6>
              <p className="text-xs mt-2 mb-1 text-black-50">
                Connect and collaborate! Whether you're a technician offering your expertise or a user seeking a quick solution, our secure messaging platform bridges the gap.
              </p>
              <p className="text-xs text-black-50">
                Select a conversation to start your journey toward resolving issues and sharing knowledge. Together, we make fixes happen, instantly.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default ChatPage;