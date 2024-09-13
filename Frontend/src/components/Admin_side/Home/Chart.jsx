import React from 'react';
import { ComposedChart, Line, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', uv: 590, pv: 800 },
  { name: 'Tue', uv: 868, pv: 967 },
  { name: 'Wed', uv: 1397, pv: 1098 },
  { name: 'Thu', uv: 1480, pv: 1200 },
  { name: 'Fri', uv: 1520, pv: 1108 },
  { name: 'Sat', uv: 1400, pv: 680 },
  { name: 'Sun', uv: 1400, pv: 680 },
];

const Chart = () => {
  return (
    <div className="col-lg-7">
      <div className="card min-height-400 p-3 d-flex justify-content-center align-items-center">
        <div className="d-flex justify-content-between align-items-center w-100 mb-3 px-3">
          <h6>Bookings</h6>
          <select className="form-control w-auto px-3">
            <option value="Last 7 days">Last 7 days</option>
            <option value="Last 15 days">Last 15 days</option>
            <option value="Last 30 days">Last 30 days</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data} margin={{ top: 20, bottom: 20, left: 20, right: 20 }}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" scale="point" padding={{ left: 20, right: 20 }} />
            <Tooltip />
            <Bar dataKey="pv" barSize={20} fill="#341919" />
            <Line type="monotone" dataKey="uv" stroke="#ff7300" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div >
  );
};

export default React.memo(Chart);