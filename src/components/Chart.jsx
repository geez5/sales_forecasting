import React from 'react';
import { Line } from 'react-chartjs-2';

export function Chart({ data, options }) {
  return (
    <div className="mt-12 bg-white rounded-lg shadow px-5 py-6 sm:px-6">
      <div className="h-96">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}