import React from "react";
import WaveShape from '../../shapes/Wave'

const SecondRow = () => {
  return (
    <div className="secondContainer">
      <WaveShape />
      <div className="leftContent">
        <h1>Heading</h1>
        <h3>Subheading</h3>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting <br />
          industry. Lorem Ipsum has been the industry's standard dummy <br />
          text ever since the 1500s, when an unknown printer took a galley of <br />
          type and scrambled it to make a type specimen book.</p>
      </div>
      <div className="rightContent shadow-xl"></div>
    </div>
  )
}

export default SecondRow;