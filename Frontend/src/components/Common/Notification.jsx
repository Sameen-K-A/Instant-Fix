import React from "react";
import { useNavigate } from "react-router-dom";

const NotificationCard = ({ bookingDetailsArray = [] }) => {

  const navigate = useNavigate();

  const goToViewMore = (booking_id) => {
    navigate("/technician/technicianBookingViewmore", { state: { booking_id: booking_id } });
  };

  return (
    <div className="top-0 end-0 me-5 pe-2 pt-1 z-index-3 ps-6 w-100 position-absolute max-width-400">
      <div className="card shadow min-height-400">
        <div className="card-body p-3 card-details">
          <h6 className="card-title mb-0 text-sm">Notification</h6>
          <hr className="horizontal dark m-0 mt-1" />
          {bookingDetailsArray.length === 0 ? (
            <div className="d-flex align-items-center height-100">
              <p className="text-xs text-center w-100 m-0">No older notifications.</p>
            </div>
          ) : (
            bookingDetailsArray.map((booking, index) => {
              if (booking?.booking_status === "Requested") {
                return (
                  <li key={index} className="list-group-item border-0 p-2 mb-2 mt-2 bg-gray-100 border-radius-lg">
                    <p className="text-xs m-0">You have a booking request from <b>{booking?.userDetails?.name}</b> on <b>{booking?.bookingDate}</b> at <b>{booking?.bookingTime}</b></p>
                    <div className="d-flex justify-content-end">
                      <button className="btn bg-gradient-primary p-1 px-3 m-0 mt-1" onClick={() => goToViewMore(booking?.booking_id)}>View more</button>
                    </div>
                  </li>
                );
              }
              return null;
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;