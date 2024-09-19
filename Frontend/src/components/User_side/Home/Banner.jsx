import React from "react";
import plumberIMG from "/public/Images/Banner-plumber-image.png";
import electricanIMG from "/public/Images/Banner-electrician-image.png";
import cleanerIMG from "/public/Images/Banner-cleaner-image.png";
import { useNavigate } from "react-router-dom";
import Reveal from "../../../../public/Animation/Animated";

const Banner = () => {

  const navigate = useNavigate();

  return (
    <section className="section position-relative">
      <div className="container">
        <div className="row">
          <div className="col-lg-5 col-md-12 col-sm-12 d-flex justify-content-center align-items-center">
            <span>
              <Reveal>
                <h2 className="font-weight-bolder text-info text-gradient pb-3">
                  Welcome to InstantFix <br /> Your One-Stop Solution
                </h2>
              </Reveal>
              <Reveal>
                <h5 className="pb-2 text-black-65 ">Find and Book Technicians Easily</h5>
              </Reveal>
              <Reveal>
                <p className="text-black-65">
                  Discover reliable and professional technicians to solve all your home service needs with just a few clicks. Our platform ensures quick, easy, and trustworthy solutions for your everyday issues.
                </p>
              </Reveal>
            </span>
          </div>
          <div className="col-lg-1" />
          <div className="col-lg-6 col-md-12 col-sm-12 d-flex justify-content-center">
            <Reveal>
              <div className="d-flex gap-3 wrappingCat">
                <div className="banner" style={{ backgroundImage: `url(${cleanerIMG})` }}>
                  <div className="banner-content">
                    <h4 className="text-end text-dark">Reliable Cleaners</h4>
                    <p className="text-end text-dark">Trustworthy cleaners to keep your space spotless.</p>
                    <div className="d-flex justify-content-end">
                      <button className="btn bg-gradient-primary" onClick={() => navigate("/allTechnicians")}>View More</button>
                    </div>
                  </div>
                </div>
                <div className="banner" style={{ backgroundImage: `url(${plumberIMG})` }}>
                  <div className="banner-content">
                    <h4 className="text-end text-dark">Professional Plumbers</h4>
                    <p className="text-end text-dark">Expert plumbers ready to fix your plumbing issues swiftly.</p>
                    <div className="d-flex justify-content-end">
                      <button className="btn bg-gradient-primary" onClick={() => navigate("/allTechnicians")}>View More</button>
                    </div>
                  </div>
                </div>
                <div className="banner" style={{ backgroundImage: `url(${electricanIMG})` }}>
                  <div className="banner-content">
                    <h4 className="text-end text-dark">Skilled Electricians</h4>
                    <p className="text-end text-dark">Certified electricians to handle all your electrical needs.</p>
                    <div className="d-flex justify-content-end">
                      <button className="btn bg-gradient-primary" onClick={() => navigate("/allTechnicians")}>View More</button>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;