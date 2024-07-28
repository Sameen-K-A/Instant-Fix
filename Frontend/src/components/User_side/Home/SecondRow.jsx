import React from "react";
import WaveShape from '../../shapes/Wave';
import rightImg from "../../../../public/images/workersIMG_1.png";

const SecondRow = () => {
  return (
    <section className="section bg-gradient-primary position-relative">
      <WaveShape />
      <div className="container pt-8">
        <div className="row">
          <div className="col-lg-6 col-md-12 col-sm-12">
            <img src={rightImg} width={"350px"} className="rounded d-block mx-auto" alt="Technician" />
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12 align-self-center mobile-bottom-fix">
            <div className="left-heading">
              <h2 className="font-weight-bolder text-light pb-3">Why Choose Instant-Fix ?</h2>
            </div>
            <div className="left-text">
              <h5 className="text-light font-weight-bolder pb-2">Reliable Services, Anytime, Anywhere</h5>
              <p className="text-light">InstantFix offers a seamless way to connect with skilled technicians for all your home service needs. Our trusted professionals ensure quality and reliability, giving you peace of mind.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SecondRow;