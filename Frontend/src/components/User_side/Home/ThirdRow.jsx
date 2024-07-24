import React from "react";
import leftIMG from "../../../../public/images/workersIMG_1.png";

const ThirdRow = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-12 col-sm-12">
            <img src={leftIMG} width={"400px"} className="rounded d-block mx-auto" alt="App" />
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12 align-self-center mobile-top-fix">
            <div className="left-heading">
              <h3 className="font-weight-bolder">We can help you to grow your business</h3>
            </div>
            <div className="left-text">
              <p>Nullam sit amet purus libero. Etiam ullamcorper nisl ut augue blandit, at finibus leo
                efficitur. Nam gravida purus non sapien auctor, ut aliquam magna ullamcorper.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ThirdRow;