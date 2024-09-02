import React from 'react';
import Footer from '../Common/Footer';
import TechnicianNavbar from './NavbarPage';
import { Communication, OnlineBar, PyChart } from '../../../public/svgs/Icons';
import backgroundImage from "../../../public/images/HeaderBanner_3.jpg";
import Reveal from '../../../public/Animation/Animated';

const TechnicianHome = () => {
  return (
    <>
      <TechnicianNavbar />

      <div className="page-header pt-3 pb-5 m-3 border-radius-lg" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <span className="mask bg-gradient-primary opacity-6"></span>
        <Reveal>
          <div className="container">
            <div className="col-lg-5 text-center mx-auto">
              <h2 className="font-weight-bolder text-light pb-3 mt-5">
                Welcome to Instant-Fix <br /> Your Professional Hub
              </h2>
              <h5 className="pb-2 text-white">Connect with Clients and Manage Jobs Effortlessly</h5>
              <p className='text-light pb-8'>
                Instant-Fix is designed to help you find job opportunities, manage your schedule, and connect with clients
                seamlessly. Leverage our platform to build a successful career in the home services industry.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <section className="section home-feature py-5 z-index-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="features-small-item blur-sm shadow-blur">
                <Reveal>
                  <div className="icon bg-gradient-primary mb-4">
                    <OnlineBar />
                  </div>
                  <h5 className="features-title">Stay on available mode</h5>
                  <p>Stay on online if you are free and ensure availablility status is on.</p>
                </Reveal>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="features-small-item blur-sm shadow-blur">
                <Reveal>
                  <div className="icon bg-gradient-primary mb-4">
                    <Communication />
                  </div>
                  <h5 className="features-title">Client Communication</h5>
                  <p>Engage directly with clients through our messaging system for clear communication.</p>
                </Reveal>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-6 col-12">
              <div className="features-small-item blur-sm shadow-blur">
                <Reveal>
                  <div className="icon bg-gradient-primary mb-4">
                    <PyChart />
                  </div>
                  <h5 className="features-title">Performance Tracking</h5>
                  <p>Track your performance and see feedback to continuously improve and succeed.</p>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section py-5 mt-3">
        <Reveal>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-12 col-sm-12 d-flex justify-content-start mb-3">
                <img src="https://img.freepik.com/free-photo/portrait-engineers-work-hours-job-site_23-2151589571.jpg?t=st=1722228287~exp=1722231887~hmac=4dcfda7dbd859c0cf13104de851d9526efca23136c69a4509036397f764df67f&w=1380" className="col-10 rounded d-block mx-auto" alt="Training" />
              </div>
              <div className="col-lg-6 col-md-12">
                <h3 className="font-weight-bold text-info text-gradient">Streamline Your Work with Instant-Fix!</h3>
                <h5 className="pb-2">Boost Your Efficiency</h5>
                <p>Utilize our platform's features to streamline your work processes and enhance your efficiency. From job scheduling to client communication, Instant-Fix has everything you need to succeed.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section mt-0">
        <Reveal>
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-12 col-sm-12 d-flex align-items-center mobile-bottom-fix">
                <div>
                  <div className="left-heading">
                    <h3 className="font-weight-bolder text-info text-gradient">Grow Your Skills with Us</h3>
                  </div>
                  <div className="left-text">
                    <h5 className="pb-2">Training and Development</h5>
                    <p>Access resources and training opportunities to further develop your skills. Stay ahead in the industry with our continuous learning options.</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 d-flex justify-content-center mt-3">
                <img src="https://img.freepik.com/free-photo/portrait-engineers-work-hours-job-site_23-2151589576.jpg?t=st=1722228243~exp=1722231843~hmac=846c3902241b7819324915615a3d30984a5d1849baa567c6c9d321e4f130ffac&w=1380" className="col-10 img-fluid rounded" alt="App Features" />
              </div>
            </div>
          </div>
        </Reveal>
      </section>
      <Footer />
    </>
  );
}

export default TechnicianHome;