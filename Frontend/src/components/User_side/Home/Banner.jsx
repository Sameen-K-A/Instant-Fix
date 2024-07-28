import React from "react";

const Banner = () => {
  return (
    <>
      <div className="home-container d-flex pt-4">
        <div className="w-40 p-6 d-flex justify-content-center flex-column">
          <h2 className="font-weight-bolder text-info text-gradient pb-3">Welcome to Instant-Fix <br /> Your One-Stop Solution</h2>
          <h5 className="pb-2">Find and Book Technicians Easily</h5>
          <p>Discover reliable and professional technicians to solve all your home service needs with just a few clicks. Our platform ensures quick, easy, and trustworthy solutions for your everyday issues.</p>
        </div>
        <div className="d-flex align-items-center py-6 px-9 w-60">
          <div className="d-flex justify-content-center align-items-center w-100 flex-grow-1 gap-3 wrappingCat">
            <div className="banner shadow-sm" style={{ backgroundImage: `url('https://img.freepik.com/free-photo/plumber-with-his-arms-crossed_1368-515.jpg?ga=GA1.1.1180808192.1698067066&semt=ais_user')` }}>
              <div className="wave"></div>
              <div className="banner-content">
                <h4 className="text-end">Professional Plumbers</h4>
                <p className="text-end">Expert plumbers ready to fix your plumbing issues swiftly.</p>
                <div className="d-flex justify-content-end">
                  <button className="btn bg-gradient-primary">View More</button>
                </div>
              </div>
            </div>
            <div className="banner shadow-sm" style={{ backgroundImage: `url('https://img.freepik.com/free-photo/electrician-fixing-wire-box_23-2147781266.jpg')` }}>
              <div className="wave"></div>
              <div className="banner-content">
                <h4 className="text-end">Skilled Electricians</h4>
                <p className="text-end">Certified electricians to handle all your electrical needs.</p>
                <div className="d-flex justify-content-end">
                  <button className="btn bg-gradient-primary">View More</button>
                </div>
              </div>
            </div>
            <div className="banner shadow-sm" style={{ backgroundImage: `url('https://img.freepik.com/free-photo/cleaner-cleaning-table-with-rag_23-2147817683.jpg')` }}>
              <div className="wave"></div>
              <div className="banner-content">
                <h4 className="text-end">Reliable Cleaners</h4>
                <p className="text-end">Trustworthy cleaners to keep your space spotless.</p>
                <div className="d-flex justify-content-end">
                  <button className="btn bg-gradient-primary">View More</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Banner;
