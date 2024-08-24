import React, { useEffect, useState } from 'react';
import Footer from '../Common/Footer';
import TechnicianNavbar from './NavbarPage';
import backgroundImage from "/images/HeaderBanner_2.png";
import Calendar from 'react-calendar';
import userAxiosInstance from '../../config/AxiosInstance/userInstance';
import { toast } from 'sonner';
import { useUserDetails } from "../../Contexts/UserDetailsContext";
import 'react-calendar/dist/Calendar.css';

const TechnicianSlotAllocation = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const { userDetails } = useUserDetails();
  const technicianDetails = userDetails?.technicianDetails[0];

  useEffect(() => {
    const alreadyAllocatedDates = technicianDetails?.availableSlots.map((slotInfo) => ({
      slotDate: new Date(slotInfo?.slotDate).toLocaleDateString('en-CA'),
      slotBooked: slotInfo?.slotBooked
    }));
    setSelectedDates(alreadyAllocatedDates);
  }, []);

  const handleDateChange = (changedDate) => {
    if (!isEdit) return;
    const date = changedDate.toLocaleDateString('en-CA');
    const dateExists = selectedDates.find(slot => slot.slotDate === date);
    setSelectedDates(prevSelectedDates => dateExists ?
      prevSelectedDates.filter(slot => slot.slotDate !== date) :
      [...prevSelectedDates, { slotDate: date, slotBooked: false }]
    );
  };

  const isDateDisabled = (date) => {
    const dateStr = date.toLocaleDateString('en-CA');
    const bookedSlot = selectedDates.find(slot => slot.slotDate === dateStr && slot.slotBooked);

    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 1);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);

    return date < minDate || date > maxDate || bookedSlot;
  };

  const saveSlotInformation = async () => {
    try {
      await userAxiosInstance.patch("/technician/modifyAvailableSlots", { technician_id: technicianDetails?.user_id, slots: selectedDates });
      const afterChanging = { ...userDetails, technicianDetails: [{ ...userDetails.technicianDetails[0], availableSlots: selectedDates }] };
      sessionStorage.setItem("userDetails", JSON.stringify(afterChanging));
      toast.success("Slot availability modified successfully.");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login", { state: { message: "Authorization failed, please login" } });
      } else if (error.response && error.response.status === 301) {
        toast.error("No changes found.");
      } else {
        toast.error("Something went wrong, please try again later.");
      };
    } finally {
      setIsEdit(false);
    };
  };

  return (
    <>
      <TechnicianNavbar />
      <nav className="bg-transparent shadow-none position-absolute ps-5 mt-5 w-100 z-index-2">
        <h6 className="font-weight-bolder mb-0 ms-2">Slot Allocation</h6>
        <p className="text-sm mt-0 ms-2">Technician/ Slot allocation</p>
      </nav>
      <div className="container-fluid">
        <div className="page-header min-height-200 border-radius-xl mt-4" style={{ backgroundImage: `url(${backgroundImage})` }} />
        <div className="row mt-3 mx-4">
          <div className="col-lg-7 col-md-12 col-sm-12 min-height-400 card card-body shadow-blur">
            <Calendar
              onChange={handleDateChange}
              tileDisabled={({ date }) => isDateDisabled(date)}
              tileClassName={({ date }) => {
                const dateStr = date.toLocaleDateString('en-CA');
                const slot = selectedDates.find(slot => slot.slotDate === dateStr);
                if (slot) {
                  return slot.slotBooked === true ? 'booked-date' : 'selected-date';
                }
                return 'available-date';
              }}
            />
          </div>
          <div className="col-lg-5 col-md-12 col-sm-12 card-plain min-height-400 d-flex flex-column justify-content-end px-5">
            <div className="instruction pt-5">
              <div className="instruction-item">
                <div className="instruction-dot" style={{ backgroundColor: "#A7F3B3" }}></div>
                <span className='text-xs m-0 mb-1'>Selected</span>
              </div>
              <div className="instruction-item">
                <div className="instruction-dot" style={{ backgroundColor: "#ffffff" }}></div>
                <span className='text-xs m-0 mb-1'>Available</span>
              </div>
              <div className="instruction-item">
                <div className="instruction-dot" style={{ backgroundColor: "#FDBDBE" }}></div>
                <span className='text-xs m-0 mb-1'>Already have booking</span>
              </div>
              <div className="instruction-item">
                <div className="instruction-dot" style={{ backgroundColor: "#E7E8EC" }}></div>
                <span className='text-xs m-0 mb-1'>Un-available</span>
              </div>
            </div>
            {isEdit ? (
              <>
                <p className='text-sm mt-3 mb-4'><strong>NOTE:</strong> Slots can only be selected for the next 60 days.<br /> Please select your available days to set slots for new job bookings. Users will only be able to view your profile if you are available, so ensure that you are marked as available on the selected slot days.</p>
                <button className='btn bg-gradient-primary mb-0' onClick={() => saveSlotInformation()}>Save Slots</button>
              </>
            ) : (
              <>
                <p className="text-sm mt-3 mb-1">
                  Set your slots as available if you are free on that date. <br />
                  Please note that clients can only book your available slots. <br />
                  make sure your status is set to 'Available.' <br /></p>
                <span className='text-xs text-black-65 mb-3 mt-2'>
                  1. Click the settings button at the bottom right. <br />
                  2. Click on 'Account Details.' <br />
                  3. On the right side, set your status to 'Available.'
                </span>
                <button className="btn btn-outline-primary mb-0" onClick={() => setIsEdit(true)}>Edit your slots</button>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TechnicianSlotAllocation;