import { toast } from "sonner";
import userAxiosInstance from "../Config/userInstance"; 

export const loadRazorpayScript = async () => {
   try {
      const script = document.createElement("script");
      script.src = import.meta.env.VITE_RAZORPAY_URL;
      script.async = true;
      document.body.appendChild(script);
      await new Promise((resolve, reject) => {
         script.onload = resolve;
         script.onerror = reject;
      });
   } catch (error) {
      console.error("Failed to load the Razorpay script.");
      toast.error("Payment gateway is not available. Please try again later.");
   };
};

export const proceedToPayment = async (booking_id, amount, technicianUser_id, setBookingDetails) => {
   try {
      const response = await userAxiosInstance.post("/proceedToPayment", { booking_id, laborCost: amount, });
      if (response.data?.order_id) {
         openRazorpayPayment(response.data, booking_id, technicianUser_id, setBookingDetails);
      } else {
         toast.error("Payment gateway is not available now, Please try again later.");
      };
   } catch (error) {
      console.log("Error initiating payment:", error);
      toast.error("Something went wrong. Please try again later.");
   };
};

const openRazorpayPayment = ({ order_id, amount, currency }, booking_id, technicianUser_id, setBookingDetails) => {
   const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount,
      currency,
      name: "Instant-Fix",
      description: "Payment for services",
      order_id,
      image: '../../public/svgs/FavIcon.svg',
      handler: (response) => handleSuccessPayment(response, booking_id, amount, technicianUser_id, setBookingDetails),
      prefill: {
         name: JSON.parse(localStorage.getItem("userDetails"))?.name,
         email: JSON.parse(localStorage.getItem("userDetails"))?.email,
      },
      theme: {
         color: "#3399cc",
      },
   };

   const rzp = new window.Razorpay(options);
   rzp.open();
};

const handleSuccessPayment = async (response, booking_id, amount, technicianUser_id, setBookingDetails) => {
   try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
      const paymentResponse = await userAxiosInstance.post("/verifyPayment", {
         payment_id: razorpay_payment_id,
         order_id: razorpay_order_id,
         signature: razorpay_signature,
         booking_id,
         amount,
         technicianUser_id,
      });

      if (paymentResponse.status === 200) {
         setBookingDetails((prevDetails) => ({ ...prevDetails, payment_status: "Completed" }));
         toast.success("Payment completed successfully!");
      } else {
         toast.error("Failed to verify payment. Please contact support.");
      };
   } catch (error) {
      console.error("Payment verification error:", error);
      toast.error("An error occurred during payment verification. Please try again.");
   };
};