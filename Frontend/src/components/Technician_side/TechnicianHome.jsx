import React from 'react';
import Footer from '../Common/Footer';

const TechnicianHome = () => {
  return (
    <>
      <div className="welcome-area">
        <div className="header-text">
          <div className="container">
            <div className="row">
              <div className="offset-xl-3 col-xl-6 offset-lg-2 col-lg-8 col-md-12 col-sm-12">
                <h1>We provide the best strategy<br />to grow up your business</h1>
                <p>Softy Pinko is a professional Bootstrap 4.0 theme designed by Template Mo
                  for your company at absolutely free of charge
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section home-feature">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="row">

                <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                  <div className="features-small-item">
                    <div className="icon">
                      <i><img src="assets/images/featured-item-01.png" alt="" /></i>
                    </div>
                    <h5 className="features-title">Best Relationship</h5>
                    <p>Contact us immediately if you have a question in mind</p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                  <div className="features-small-item">
                    <div className="icon">
                      <i><img src="assets/images/featured-item-01.png" alt="" /></i>
                    </div>
                    <h5 className="features-title">Best Relationship</h5>
                    <p>Contact us immediately if you have a question in mind</p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                  <div className="features-small-item">
                    <div className="icon">
                      <i><img src="assets/images/featured-item-01.png" alt="" /></i>
                    </div>
                    <h5 className="features-title">Ultimate Marketing</h5>
                    <p>You just need to tell your friends about our free templates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12 align-self-center">
              <img src="https://t3.ftcdn.net/jpg/05/85/86/44/360_F_585864419_kgIYUcDQ0yiLOCo1aRjeu7kRxndcoitz.jpg" width={"350px"} className="rounded d-block mx-auto" alt="App" />
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

      <section className="section padding-bottom-100">
        <div className="container">
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
              <img src="https://t3.ftcdn.net/jpg/05/85/86/44/360_F_585864419_kgIYUcDQ0yiLOCo1aRjeu7kRxndcoitz.jpg" width={"350px"} className="rounded d-block mx-auto" alt="image" />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default TechnicianHome;