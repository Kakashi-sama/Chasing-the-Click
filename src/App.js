import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { isoCountries } from './isoCountries';

const initialData = [
  ['Country', 'Popularity'],
  ...Object.keys(isoCountries).map((countryCode) => [countryCode, 0]),
];

const loadDataFromLocalStorage = () => {
  const storedData = localStorage.getItem('geoChartData');
  if (storedData) {
    return JSON.parse(storedData);
  }
  return initialData;
};

const App = () => {
  const [data, setData] = useState(loadDataFromLocalStorage());

  useEffect(() => {
    localStorage.setItem('geoChartData', JSON.stringify(data));
  }, [data]);

  const handleRegionClick = ({ chartWrapper }) => {
    const chart = chartWrapper.getChart();
    const selection = chart.getSelection();
    if (selection.length === 0) return;

    const rowIndex = selection[0].row + 1;
    const region = data[rowIndex];

    const updatedData = data.map((row, index) => {
      if (index === rowIndex) {
        return [row[0], row[1] + 1];
      }
      return row;
    });

    setData(updatedData);
  };

  const resetData = () => {
    setData(initialData);
  };

  return (
    <div>
      <Chart
        chartEvents={[
          {
            eventName: 'select',
            callback: handleRegionClick,
          },
        ]}
        chartType="GeoChart"
        width="100%"
        height="400px"
        data={data}
        options={{
          colorAxis: { minValue: 0, maxValue: 10, colors: ['#f0f0f0', '#e31a1c'] },
          legend: 'none',
        }}
      />
      <button onClick={resetData}>Reset Data</button>
    </div>
  );
};

export default App;
