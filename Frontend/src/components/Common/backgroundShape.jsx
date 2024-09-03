import backgroundImage from "../../../public/images/HeaderBanner_3.jpg"

const BackgroundShape = () => {
  return (
    <div className="col-md-6 mb-5">
      <div className="oblique position-absolute top-0 h-100 d-md-block d-none me-n8" >
        <div className="oblique-image bg-cover position-absolute fixed-top ms-auto h-100 ms-n6" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <span className="mask bg-gradient-primary opacity-5"></span>
        </div>
      </div>
    </div>
  )
}

export default BackgroundShape