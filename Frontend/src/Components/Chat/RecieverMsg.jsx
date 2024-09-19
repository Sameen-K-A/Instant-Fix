const RecieverMsg = ({ message, time }) => {
  return (
    <>
      <div className="reciever d-flex justify-content-start">
        <p className="text p-3 max-width-800 bg-white border-radius-lg mb-2 text-sm border-radius-bottom-start-0">{message}</p>
      </div>
      <p className="text-xxs text-start">{time}</p>
    </>
  )
}

export default RecieverMsg;