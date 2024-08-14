const BookingConfirmModal = () => {

  return (
    <div className="modal fade" id="bookingConfirmModal" tabIndex="-1" aria-labelledby="bookingConfirmModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body p-4 pt-5">
            <h5 className="modal-title text-center" id="bookingConfirmModalLabel">Confirm your Booking</h5>
            <form className='my-4'>
              <input type="text" className="form-control" placeholder="Name" />
              <div className='d-flex justify-content-center align-items-center mt-4'>
                <button type="button" className="btn btn-outline-primary w-30 me-3 my-0" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn bg-gradient-primary w-30 my-0">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div >
    </div >
  );

};

export default BookingConfirmModal;