import { Fragment, useEffect, useRef, useState } from "react";
import RecieverMsg from "./RecieverMsg";
import SenderMsg from "./SenderMsg";
import { Send } from '../../../public/svgs/Icons';
import { toast } from 'sonner';
import userAxiosInstance from "../../Config/userInstance";
import io from "socket.io-client";
const socket = io(import.meta.env.VITE_BASE_URL);
import { useUserDetails } from "../../Contexts/UserDetailsContext";
import { useNavigate } from "react-router-dom";
import { useUserAuthContext } from "../../Contexts/UserAuthContext";
import { GoDotFill } from "react-icons/go";

const ChatScreen = ({ currentChatting }) => {
  const [chatHistory, setChatHistory] = useState(null);
  const { userDetails } = useUserDetails();
  const [newMsg, setNewMsg] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { setIsLogged } = useUserAuthContext();

  useEffect(() => {
    (async () => {
      try {
        const response = await userAxiosInstance.get(`/chat/fetchTwoMembersChat`, { params: { senderID: userDetails?.user_id, receiverID: currentChatting?.user_id } });
        setChatHistory(response.data);
        socket.emit("joinChatRoom", { senderID: userDetails?.user_id, receiverID: currentChatting?.user_id });
      } catch (error) {
        if (error.response.status === 401) {
          setIsLogged(false);
          navigate("/login", { state: { message: "Authorization failed, please login" } });
        } else {
          toast.error("Something wrong, Can't fetch chat history. Please try again later");
        }
      }
    })();
  }, [currentChatting]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  useEffect(() => {
    socket.on("receiveMessage", (messageDetails) => {
      setChatHistory((prevChatHistory) => [...prevChatHistory, { details: messageDetails }]);
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const handleSendMsg = async () => {
    if (newMsg.trim()) {
      try {
        const current = new Date();
        const messageDetails = {
          senderID: userDetails?.user_id,
          receiverID: currentChatting?.user_id,
          message: newMsg,
          time: current.toISOString().slice(0, 16).replace('T', ', ')
        };
        const firstTimeChat = chatHistory.length === 0 ? true : false;
        socket.emit("sendMessage", { messageDetails, firstTimeChat });
        setNewMsg("");
      } catch (error) {
        if (error.response.status === 401) {
          setIsLogged(false);
          navigate("/login", { state: { message: "Authorization failed, please login" } });
        } else {
          toast.error("Something went wrong, please try again later");
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMsg();
    }
  };

  useEffect(() => {
    socket.on("receiverIsOnline", ({ user_id }) => {
      if (user_id === currentChatting?.user_id) {
        setIsOnline(true);
      };
    });

    socket.on("receiverIsOffline", ({ user_id }) => {
      if (user_id === currentChatting?.user_id) {
        setIsOnline(false);
      }
    });

    return () => {
      socket.off("receiverIsOnline");
      socket.off("receiverIsOffline");
    };
  }, [currentChatting]);

  return (
    <>
      <div className="card p-3 shadow">
        <div className='d-flex align-items-center'>
          <img src={`${currentChatting?.profileIMG}`} alt="profile_image" width="45px" height="45px" style={{ borderRadius: "50%" }} />
          <div>
            <h6 className="ms-2 mt-2 mb-0">{currentChatting?.name}</h6>
            {isOnline ? <p className="text-xxs m-0 ms-2 opacity-8"><GoDotFill color="green" />Online</p> : <p className="text-xxs m-0 ms-2"><GoDotFill color="red" />Offline</p>}
          </div>
        </div>
      </div>
      <div className="chat-container mt-4 p-3" style={{ overflowY: 'auto', height: 'calc(85vh - 180px)' }}>
        {chatHistory !== null && (
          chatHistory.map((chat, index) => (
            <Fragment key={index + 1}>
              {chat?.details?.senderID === userDetails?.user_id ? (
                <SenderMsg message={chat?.details?.message} time={chat?.details?.time} />
              ) : (
                <RecieverMsg message={chat?.details?.message} time={chat?.details?.time} />
              )}
            </Fragment>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className='mt-3 px-3 d-flex align-items-center justify-content-center gap-3 me-5'>
        <input type="text" className='form-control py-3' placeholder='Enter your message' value={newMsg} onChange={(e) => setNewMsg(e.target.value)} onKeyDown={handleKeyDown} />
        <button className='btn btn-outline-primary mb-0 py-3 d-flex align-items-center justify-content-center' onClick={handleSendMsg} ><Send /></button>
      </div>
    </>
  );
};

export default ChatScreen;