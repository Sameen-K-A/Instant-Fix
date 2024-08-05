import ChatFriends from "../../components/Chat/ChatFriends"
import MessageHeader from "../../components/Chat/MessageHeader"
import MsgBtn from "../../components/Chat/MsgBtn"
import RecieverMsg from "../../components/Chat/RecieverMsg"
import SenderMsg from "../../components/Chat/SenderMsg"
import UserNavbar from "../../components/User_side/NavbarPage"

const ChatPage = () => {
  return (
    <>
      <UserNavbar />
      <div className="row m-3" style={{ overflow: 'hidden', minHeight: '88vh' }}>
        <ChatFriends />
        <section className="chat col-lg-9">
          <MessageHeader />
          <div className="mt-4 p-3" style={{ overflowY: 'auto', height: 'calc(85vh - 180px)' }}>
            <RecieverMsg />
            <SenderMsg />
            <RecieverMsg />
            <SenderMsg />
            <RecieverMsg />
            <SenderMsg />
            <RecieverMsg />
            <SenderMsg />
            <RecieverMsg />
            <SenderMsg />
            <RecieverMsg />
            <SenderMsg />
            <RecieverMsg />
            <SenderMsg />
            <RecieverMsg />
            <SenderMsg />
            <RecieverMsg />
            <SenderMsg />
            <RecieverMsg />
            <SenderMsg />
          </div>
          <MsgBtn />
        </section>
      </div>
    </>
  );
};

export default ChatPage;