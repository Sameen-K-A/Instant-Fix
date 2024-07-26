import React from 'react';
import Footer from '../Common/Footer';
import TechnicianNavbar from './NavbarPage';

const TechnicianHome = () => {
  return (
    <>
      <TechnicianNavbar />
      <div className="welcome-area">
        <div className="header-text">
          <div className="container">
            <div className="row">
              <div className="offset-xl-3 col-xl-6 offset-lg-2 col-lg-8 col-md-12 col-sm-12">
                <h1>Main Content</h1>
                <p>Details about home page content</p>
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
                    <h5 className="features-title">Content</h5>
                    <p>Details about the content</p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                  <div className="features-small-item">
                    <div className="icon">
                      <i><img src="assets/images/featured-item-01.png" alt="" /></i>
                    </div>
                    <h5 className="features-title">Content</h5>
                    <p>Details about the content</p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                  <div className="features-small-item">
                    <div className="icon">
                      <i><img src="assets/images/featured-item-01.png" alt="" /></i>
                    </div>
                    <h5 className="features-title">Content</h5>
                    <p>Details about the content</p>
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
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg5rzAn4C8DGEWIGmlapJtgE-82rCC1XUnLACJqaEyrn88M4iC1FAKuwi_zPykUDnDfNE&usqp=CAU" width={"350px"} className="rounded d-block mx-auto" alt="App" />
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12 align-self-center mobile-top-fix">
              <div className="left-heading">
                <h3 className="font-weight-bolder">Main Content</h3>
              </div>
              <div className="left-text">
                <p>Details about the content</p>
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
                <h3 className="font-weight-bolder">Main Content</h3>
              </div>
              <div className="left-text">
                <p>Details about the content</p>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmeoYSCfXExdkRZrvaK1z-YMEC2mzQWP5270F6i9F5tBULQCj6AwlAhwcjKZ_hyIxskRo&usqp=CAU" width={"350px"} className="rounded d-block mx-auto" alt="image" />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default TechnicianHome;