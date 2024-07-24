import React from "react";
import WaveShape from '../../shapes/Wave';
import rightImg from "../../../../public/images/workersIMG_1.png";

const SecondRow = () => {
  return (
    <section className="section bg-gradient-primary" style={{ position: "relative" }}>
      <WaveShape />
      <div className="container pt-8">
        <div className="row">
          <div className="col-lg-6 col-md-12 col-sm-12 align-self-center mobile-bottom-fix">
            <div className="left-heading">
              <h3 className="font-weight-bolder">We can help you to grow your business</h3>
            </div>
            <div className="left-text">
              <p>Aenean pretium, ipsum et porttitor auctor, metus ipsum iaculis nisi, a bibendum lectus libero
                vitae urna. Sed id leo eu dolor luctus congue sed eget ipsum. Nunc nec luctus libero. Etiam
                quis dolor elit.
              </p>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12">
            <img src={rightImg} width={"350px"} className="rounded d-block mx-auto" alt="image" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default SecondRow;