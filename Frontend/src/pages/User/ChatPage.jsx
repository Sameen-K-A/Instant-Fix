import { useLocation } from "react-router-dom";
import ChatFriends from "../../Components/Chat/ChatFriends";
import UserNavbar from "../../Components/User_side/NavbarPage";
import { useEffect, useState } from "react";
import userAxiosInstance from "../../Config/userInstance";
import { toast } from "sonner";
import ChatScreen from "../../Components/Chat/ChatScreen";
import TechnicianNavbar from "../../Components/Technician_side/NavbarPage";
import { useUserDetails } from "../../Contexts/UserDetailsContext";
import io from "socket.io-client";
const socket = io(import.meta.env.VITE_BASE_URL);
import Reveal from "../../../public/Animation/Animated";
import { useUserAuthContext } from "../../Contexts/UserAuthContext";

const ChatPage = () => {

  const location = useLocation();
  const [instantChatTechnicianDetails, setInstantChatTechnicianDetails] = useState(null);
  const [previousChattedTechnicians, setPreviousChattedTechnicians] = useState([]);
  const [currentChatting, setCurrentChatting] = useState(null);
  const { userDetails } = useUserDetails();
  const { setIsLogged } = useUserAuthContext();

  useEffect(() => {
    setInstantChatTechnicianDetails(location.state?.details);
    setCurrentChatting(location.state?.details);
    (async () => {
      try {
        const response = await userAxiosInstance.get(`/fetchAlreadyChattedTechnicians?user_id=${userDetails?.user_id}`);
        setPreviousChattedTechnicians(response.data);
      } catch (error) {
        if (error.response.status === 401) {
          setIsLogged(false);
          navigate("/login", { state: { message: "Authorization failed, please login" } });
        } else {
          toast.error("Something wrong, can't collection chatting details. Please try again later.")
        }
      }
    })();
  }, []);

  useEffect(() => {
    socket.emit("enterToChatScreen", { user_id: userDetails?.user_id });

    return () => {
      socket.emit("leaveFromChatScreen", { user_id: userDetails?.user_id });
    };
  }, []);

  return (
    <>
      {location.pathname === "/technician/chat" ? <TechnicianNavbar /> : <UserNavbar />}
      <Reveal>
        <div className="row m-3" style={{ overflow: 'hidden', minHeight: '88vh' }}>
          <ChatFriends instantChatTechnicianDetails={instantChatTechnicianDetails} previousChattedTechnicians={previousChattedTechnicians} setCurrentChatting={setCurrentChatting} />
          <section className={`chat col-lg-9 ${location.pathname === "/chat" && "pe-6"}`}>
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
      </Reveal>
    </>
  );
};

export default ChatPage;