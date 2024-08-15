import { useState } from 'react';
import BookingTimerImage from '../../../public/images/BookingTimer.png';
import { toast } from 'sonner';
import userAxiosInstance from "../../config/AxiosInstance/userInstance";
import { useNavigate } from 'react-router-dom';

const BookingConfirmModal = ({ userDetails, setBookingInformation, technicianDetails }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const closeModal = () => {
    const modal = document.getElementById('bookingConfirmModal');
    const backdrop = document.querySelector('.modal-backdrop');
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    if (backdrop) backdrop.remove();
    document.body.classList.remove('modal-open');
    document.body.style = '';
  };

  const bookTechnician = async () => {
    if (!userDetails.addressDetails) {
      toast.error("Please add your address for booking.");
      return;
    }
    setIsLoading(true);
    try {
      const bookingResponse = await userAxiosInstance.post("/bookTechnician", { clientDetails: userDetails, technicianDetails: technicianDetails });
      setBookingInformation(bookingResponse.data);
      toast.success("Booking request sent successfully, please wait for the confirmation.");
      closeModal();
    } catch (error) {
      if (error.response.status === 401) {
        navigate("/login", { state: { message: "Authorization failed, please login" } });
      } else if (error.response.status === 409) {
        toast.error("Booking failed. Please try again later.");
      } else if (error.response.status === 404) {
        toast.error("Technician not available now, please connect with another technician.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      closeModal();
    } finally {
      setIsLoading(false);
    }
  };

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
              {isLoading ? (
                <button type="button" className="btn bg-gradient-primary w-30 my-0">Loading . . .</button>
              ) : (
                <button type="button" className="btn bg-gradient-primary w-30 my-0" onClick={() => bookTechnician()}>Confirm</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmModal;