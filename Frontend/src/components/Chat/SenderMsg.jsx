const SenderMsg = ({ message, time }) => {
  return (
    <>
      <div className="sender d-flex justify-content-end ">
        <p className="text max-width-800 p-3 bg-gradient-chatSender border-radius-lg mb-2 text-sm border-radius-bottom-end-0">{message}</p>
      </div>
      <p className="text-xxs text-end">{time}</p>
    </>
  )
}

export default SenderMsg;