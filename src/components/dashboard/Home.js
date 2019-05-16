import React from 'react';
import Tile from './Tile';

const Home = () => (
  <div className="abasi-dashboard flex">
    <div className="abasi-dashboard-tiles flex">
      <Tile title="Orders" url="/orders" />
      <Tile title="Manage Assets" url="/assets" />
      <Tile title="Manage Active Config" url="/config" />
      <Tile title="Statistics Dashboard" url="/statistics" />
    </div>
  </div>
);

export default Home;
