import BookingTimerImage from '../../../public/images/BookingTimer.png';

const BookingConfirmModal = () => {
  return (
    <div className="modal fade" id="bookingConfirmModal" tabIndex="-1" aria-labelledby="bookingConfirmModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body p-4 pt-5">
            <h5 className="modal-title text-center" id="bookingConfirmModalLabel">Confirm your Booking</h5>
            <div className="text-center my-3 opacity-8">
              <img src={BookingTimerImage} alt="Clock Timer" style={{ width: '70px', height: '70px' }} />
            </div>
            <p className="text-center text-sm">
              Click the <b>'Confirm'</b> button to confirm your booking. Once confirmed, please wait for the technician to accept your request.
              You will receive a notification once the technician responds. If the technician neither accepts nor declines your request
              within 2 hours, your booking will automatically be canceled. Thank you for your patience.
            </p>
            <div className="d-flex justify-content-center align-items-center mt-4 mb-4">
              <button type="button" className="btn btn-outline-primary w-30 me-3 my-0" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" className="btn bg-gradient-primary w-30 my-0">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmModal;