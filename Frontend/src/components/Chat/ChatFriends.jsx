const ChatFriends = () => {
  return (
    <section className="col-lg-3 mb-3 min-height-600 card shadow">
      <div className="d-flex align-item-center cursor-pointer py-4 border-bottom-sm">
        <img src="https://media.gq-magazine.co.uk/photos/5d139f7b003d75649cae6ad5/1:1/w_1280,h_1280,c_limit/Ronaldo-GQ-23nov17_GettyImages875941708.jpg" className='ms-4' width={"45px"} height={"45px"} style={{ borderRadius: "50%" }} />
        <div>
          <h6 className="ms-3 mt-1 text-sm">Ronaldo</h6>
          <p className="text-xs ms-3 text-thin mb-0">hey iam cristiano ronaldo</p>
        </div>
      </div>
    </section>
  )
}

export default ChatFriends;