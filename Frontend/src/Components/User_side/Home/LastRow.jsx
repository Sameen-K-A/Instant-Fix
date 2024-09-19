import React from 'react';
import { OnlinePayment, LocationIcon, Lightning } from '../../../../public/svgs/Icons';
import Reveal from '../../../../public/Animation/Animated';

const LastRaw = () => {
  return (
    <section className="container pt-7 pb-4" id="features">
      <div className="text-center mb-4">
        <Reveal>
          <h2 className="font-weight-bolder text-info text-gradient pb-1">Key Features</h2>
        </Reveal>
        <Reveal>
          <h5 className="pb-5">Discover how InstantFix makes your life easier.</h5>
        </Reveal>
      </div>
      <Reveal>
        <div className="row text-center">
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card border-0 shadow-lg">
              <div className="card-body">
                <OnlinePayment />
                <h5 className="card-title mt-3 pt-2">Secure Online Payment</h5>
                <p className="card-text py-3">Make payments quickly and safely using our integrated online payment system. Your financial security is our priority.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card border-0 shadow-lg">
              <div className="card-body">
                <LocationIcon />
                <h5 className="card-title mt-3 pt-2">Find Technicians Nearby</h5>
                <p className="card-text py-3">Easily locate and book technicians based on your location. Get the help you need, right when you need it.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card border-0 shadow-lg">
              <div className="card-body">
                <Lightning />
                <h5 className="card-title mt-3 pt-2">Exclusive Feature</h5>
                <p className="card-text py-3">Experience our unique feature designed to enhance your interaction with the platform. Stay tuned for more details!</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default LastRaw;