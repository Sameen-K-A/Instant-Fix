import React, { useState } from 'react';
import Footer from '../Common/Footer';
import TechnicianNavbar from './NavbarPage';
import backgroundImage from "/images/HeaderBanner_2.png";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const TechnicianSlotAllocation = () => {
  const [selectedDates, setSelectedDates] = useState([]);

  const handleDateChange = (changedDate) => {
    const date = changedDate.toISOString().split('T')[0];
    setSelectedDates((prevSelectedDates) => prevSelectedDates.includes(date) ? prevSelectedDates.filter((dates) => dates !== date) : [...prevSelectedDates, date]);
  }

  const isDateDisabled = (date) => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 1);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    return date < minDate || date > maxDate;
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
        <div className="row mt-5 mx-4">
          <div className="col-lg-7 col-md-12 col-sm-12 min-height-400 card card-body shadow-blur">
            <Calendar onChange={handleDateChange} tileDisabled={({ date }) => isDateDisabled(date)}
              tileClassName={({ date }) => {
                const dateStr = date.toISOString().split('T')[0];
                if (selectedDates.includes(dateStr)) {
                  return 'selected-date';
                };
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
                <span className='text-xs m-0 mb-1'>Not selected</span>
              </div>
              <div className="instruction-item">
                <div className="instruction-dot" style={{ backgroundColor: "#B5D2FF" }}></div>
                <span className='text-xs m-0 mb-1'>Already have booking</span>
              </div>
              <div className="instruction-item">
                <div className="instruction-dot" style={{ backgroundColor: "#E7E8EC" }}></div>
                <span className='text-xs m-0 mb-1'>Un-available</span>
              </div>
            </div>
            <p className='text-sm mt-3 mb-4'><strong>NOTE:</strong> Slots can only be selected for the next 60 days.<br /> Please select your available days to set slots for new job bookings. Users will only be able to view your profile if you are available, so ensure that you are marked as available on the selected slot days.</p>
            <button className='btn bg-gradient-primary '>Save Slots</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TechnicianSlotAllocation;