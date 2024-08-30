import { useState } from "react";
import { toast } from "sonner";
import userAxiosInstance from "../../config/AxiosInstance/userInstance";
import triggerConfetti from "../../Utils/Confetti";

const WorkCompletedModal = ({ setWorkCompleted, bookingDetails, setBookingDetails }) => {
  const [isYes, setIsYes] = useState(false);
  const [laborCharge, setLaborCharge] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const enterLabourCharge = (event) => {
    let input = event.target.value;
    if (/^[0-9]*$/.test(input)) {
      if (input.length > 1 && input.startsWith("0")) {
        input = input.replace(/^0+/, "");
      };
      setLaborCharge(input);
    };
  };

  const request_LaborCharge = async () => {
    const charge = Number(laborCharge);
    if (charge < 100) {
      toast.error("The labor charge must be at least 100.")
      return;
    };
    if (charge > 25000) {
      toast.error("The labor charge cannot exceed 25,000.");
      return;
    };
    try {
      setIsLoading(true);
      await userAxiosInstance.post("/technician/confirmBooking", { booking_id: bookingDetails.booking_id, client_id: bookingDetails.client_id, laborCharge: laborCharge, });
      const afterComplete = { ...bookingDetails, serviceCost: laborCharge, Payment_Status: "Requested", booking_status: "Completed", serviceCompletedDate: new Date().toLocaleDateString('en-CA') };
      setBookingDetails(afterComplete);
      setWorkCompleted(false);
      toast.success("Request for payement.");
      triggerConfetti();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login", { state: { message: "Authorization failed please login" } });
      } else if (error.response && error.response.status === 301) {
        toast.error("Booking details is not changed");
      } else if (error.response && error.response.status === 404) {
        toast.error("Can't find the client details");
      } else {
        toast.error("Can't change booking is complete");
      };
    } finally {
      setIsLoading(false)
    };
  };

  return (
    <div className="row mx-4 d-flex align-items-center">
      {!isYes ? (
        <>
          <h5 className="text-center">Is your work completed?</h5>
          <div className="d-flex justify-content-center gap-2">
            <button className="btn btn-outline-primary m-0" onClick={() => setWorkCompleted(false)}>Not completed</button>
            <button className="btn bg-gradient-primary m-0" onClick={() => setIsYes(true)}>  Yes, Completed</button>
          </div>
        </>
      ) : (
        <>
          <h6 className="text-center">Send payment request to client</h6>
          <div className="d-flex justify-content-center gap-2">
            <input type="text" placeholder="Please enter labor cost" className="form-control max-width-300" style={{ height: "45px" }} value={laborCharge} onChange={enterLabourCharge} />
            {isLoading ? (
              <button className="btn bg-gradient-primary" style={{ height: "45px" }} >Please wait . . .</button>
            ) : (
              <button className="btn bg-gradient-primary" style={{ height: "45px" }} onClick={request_LaborCharge}>Request Payment</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WorkCompletedModal;