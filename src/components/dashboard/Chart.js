import React from 'react';
import { RadialChart } from 'react-vis';

const Chart = (props) => {
  return (
    <RadialChart
      data={props.data}
      width={300}
      height={300}
    />
  );
}
export default Chart;