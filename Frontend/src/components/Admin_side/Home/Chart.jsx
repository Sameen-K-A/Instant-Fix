import React, { useEffect, useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import adminAxiosInstance from '../../../Config/AxiosInstance/adminInstance';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const bookingDetails = payload[0].payload.bookings;
    return (
      <div className="card card-body shadow-sm blur-sm" >
        <p className="text-xs m-0 mb-1"><strong>Date:</strong> {label}</p>
        <p className="text-xs m-0 mb-1"><strong>Total Bookings:</strong> {payload[0].value}</p>
        {bookingDetails.length > 0 ? (
          <>
            <strong className='text-xs'>Booking Details:</strong>
            <ul className='ps-1 mt-2'>
              {bookingDetails.map((booking, index) => (
                <li className='text-xxs' key={index}>
                  {booking.booking_profession} - {booking.booking_status}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className='text-xs'>No bookings available</p>
        )}
      </div>
    );
  } else {
    return null;
  };
};

const Chart = () => {
  const [selectedRange, setSelectedRange] = useState('Last 7 days');
  const [data, setData] = useState([]);

  useEffect(() => {
    const totalDays = selectedRange === 'Last 7 days' ? 7 : (selectedRange === 'Last 15 days' ? 15 : 30);
    const selectedDates = [];
    const today = new Date();

    for (let i = totalDays - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      selectedDates.push(date.toLocaleDateString('en-CA'));
    }

    (async () => {
      try {
        const response = await adminAxiosInstance.get('/filteredBooking', {
          params: { selectedDates: selectedDates },
        });
        const modifiedResponse = selectedDates.map((date) => {
          const booking = response.data.find((item) => item.bookingDate === date);
          return booking ? booking : { bookingDate: date, totalBookings: 0, bookings: [] };
        });
        setData(modifiedResponse);
      } catch (error) {
        toast.error('Something went wrong, please try again later.');
      }
    })();
  }, [selectedRange]);

  return (
    <div className="col-lg-7">
      <div className="card p-3 d-flex justify-content-center align-items-center" style={{ minHeight: '410px' }}>
        <div className="d-flex justify-content-between align-items-center w-100 px-3">
          <h6>Bookings</h6>
          <select className="form-control w-auto px-3" value={selectedRange} onChange={(e) => setSelectedRange(e.target.value)} >
            <option value="Last 7 days">Last 7 days</option>
            <option value="Last 15 days">Last 15 days</option>
            <option value="Last 30 days">Last 30 days</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data} margin={{ top: 20, bottom: 50, left: 20, right: 20 }}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="bookingDate" className="text-xxs text-bold" scale="point" dy={40} angle={270} interval={0} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="totalBookings" barSize={20} fill="#341919" />
            <Line type="monotone" dataKey="totalBookings" stroke="#ff7300" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default React.memo(Chart);