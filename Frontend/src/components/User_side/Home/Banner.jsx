import React from "react";

const Banner = () => {
  return (
    <>
      <div className="home-container">
        <div className="intro">
          <h1>Main banner <br /> Content</h1>
          <h2>Sub content</h2>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy
            text ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book.
          </p>
        </div>
        <div className="categories">
          <div className="wrappingCat">
            <div className="banner shadow-sm"></div>
            <div className="banner shadow-sm"></div>
            <div className="banner shadow-sm"></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Banner;