import React, { memo } from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';

const PieChartComponent = ({categories}) => {

  const COLORS = ['#825554', '#E1AAA8', '#4B152E', '#341701', '#F5D9D8'];

  const renderCustomizedLabel = ({ x, y, profession }) => {
    return (
      <text x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="central" fontSize={12}>
        {`${profession}`}
      </text>
    );
  };

  const renderLegend = () => {
    return categories.map((category, index) => {
      const percentage = ((category?.count / categories.length) * 100);
      return (
        <div key={index} className="d-flex align-items-center mb-1 px-3">
          <span style={{ display: 'inline-block', width: 10, height: 10, backgroundColor: COLORS[index % COLORS.length] }} />
          <span className='text-xs ms-3'>{category.profession} ({percentage}%)</span>
        </div>
      );
    });
  };

  return (
    <div className="col-lg-4">
      <div className="card min-height-300 p-3">
        <h6 className="m-2 mb-3">Categories</h6>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie dataKey="count" data={categories} outerRadius={100} label={renderCustomizedLabel} labelLine={false}>
              {categories.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-3">{renderLegend()}</div>
      </div>
    </div>
  );
};

export default memo(PieChartComponent);