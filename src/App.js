// App.js
import React from 'react';
import Chart from './chart/chart';
// import solardata from './data/solardata.json';
import makeDate from './chart/makeDate';

const App = () => {
  // const chartData = solardata;
  const chartDay = makeDate;
  return <Chart chartDay={chartDay} />;
  // return <Chart />;
};

export default App;
