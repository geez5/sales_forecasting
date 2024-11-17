import React, { useState, useEffect } from 'react';
import { Chart } from './components/Chart';
import { StatsCard } from './components/StatsCard';
import { PredictionEngine } from './predictionEngine';

const historicalSales = [
  120, 132, 145, 130, 128, 142, 138,
  145, 148, 152, 138, 142, 150, 156,
  160, 162, 158, 152, 148, 154, 160
];

export default function App() {
  const [predictionData, setPredictionData] = useState({
    predictions: [],
    dates: [],
    stats: {
      average: '0.00',
      maximum: '0.00',
      trend: 'Loading...'
    }
  });

  useEffect(() => {
    const predictor = new PredictionEngine();
    const results = predictor.predict(historicalSales);
    
    const average = results.predictions.length > 0
      ? (results.predictions.reduce((a, b) => a + b, 0) / results.predictions.length).toFixed(2)
      : '0.00';
    
    const maximum = results.predictions.length > 0
      ? Math.max(...results.predictions).toFixed(2)
      : '0.00';
    
    const trend = results.predictions.length > 0
      ? results.predictions[results.predictions.length - 1] > results.predictions[0]
        ? '📈 Up'
        : '📉 Down'
      : 'Loading...';

    setPredictionData({
      predictions: results.predictions,
      dates: results.dates,
      stats: { average, maximum, trend }
    });
  }, []);

  const chartData = {
    labels: predictionData.dates,
    datasets: [
      {
        label: 'Predicted Sales',
        data: predictionData.predictions,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      },
      {
        label: 'Historical Sales',
        data: historicalSales.slice(-7),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
        fill: false,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Prediction Forecast'
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Sales Prediction Dashboard
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Forecasting future sales using machine learning
          </p>
        </div>
        
        <Chart data={chartData} options={options} />

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <StatsCard title="Average Prediction" value={predictionData.stats.average} />
          <StatsCard title="Maximum Predicted Sales" value={predictionData.stats.maximum} />
          <StatsCard title="Trend" value={predictionData.stats.trend} />
        </div>
      </div>
    </div>
  );
}