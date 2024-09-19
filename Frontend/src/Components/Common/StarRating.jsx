import React from 'react';
import { Star } from '../../../public/svgs/Icons';

const RatingStar = ({ rating, setRating }) => {
  const ratedArray = [1, 2, 3, 4, 5];

  return (
    <div className="star-rating d-flex">
      {ratedArray.map((value) => (
        <p key={value} style={{ marginRight: "4px" }} onClick={() => setRating(value)}>
          {rating >= value ? <Star color={"#ffbb00"} /> : <Star />}
        </p>
      ))}
    </div>
  );

};

export default RatingStar;
