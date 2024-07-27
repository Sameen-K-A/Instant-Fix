import backgroundImage from "/images/Login&RegisterBackground.jpg"

const BackgroundShape = () => {
  return (
    <div className="col-md-6 mb-3">
      <div className="oblique position-absolute top-0 h-100 d-md-block d-none me-n8" >
        <div className="oblique-image bg-cover position-absolute fixed-top ms-auto h-100 ms-n6" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <span className="mask bg-gradient-primary opacity-8"></span>
        </div>
      </div>
    </div>
  )
}

export default BackgroundShape