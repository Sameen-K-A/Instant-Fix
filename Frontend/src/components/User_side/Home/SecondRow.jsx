import React from "react";
import WaveShape from '../../shapes/Wave';

const SecondRow = () => {
  return (
    <section className="section bg-gradient-primary position-relative">
      <WaveShape />
      <div className="container pt-6">
        <div className="row">
          <div className="col-lg-6 col-md-12 col-sm-12">
            <img
              src="https://img.freepik.com/free-photo/group-workers-having-meeting-with-company-managers-factory-focus-is-female-worker-is-presenting-development-reports_637285-4146.jpg?t=st=1722195349~exp=1722198949~hmac=d4079756387b55d4b20dddd91da52810d176e49421fea9c47886b987f59c87ff&w=1060"
              className="rounded d-block mx-auto col-10 mb-4"
              alt="Technician"
            />
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12 d-flex align-items-center mobile-bottom-fix">
            <div>
              <div className="left-heading">
                <h2 className="font-weight-bolder text-light pb-3">Why Choose Instant-Fix?</h2>
              </div>
              <div className="left-text">
                <h5 className="font-weight-bolder pb-2" style={{ color: "black" }}>Reliable Services, Anytime, Anywhere</h5>
                <p className="text-light">Instant-Fix offers a seamless way to connect with skilled technicians for all your home service needs. Our trusted professionals ensure quality and reliability, giving you peace of mind.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecondRow;
