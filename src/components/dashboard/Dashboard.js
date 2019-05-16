import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import Home from './Home';
import Orders from './Orders';
import OrderListing from './OrderListing';
import ManageAssets from './ManageAssets';
import ManageConfiguration from './ManageConfiguration';
import AddConfiguration from './AddConfiguration';
import Statistics from './Statistics';

const Dashboard = ({ user }) => (
  <div className="flex">
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/orders" component={Orders} />
      <Route exact path="/orders/:id" component={OrderListing} />
      <Route exact path="/assets" component={ManageAssets} />
      <Route exact path="/config" component={ManageConfiguration} />
      <Route exact path="/add-config" component={AddConfiguration} />
      <Route exact path="/edit-config/:id" component={AddConfiguration} />
      <Route exact path="/statistics" component={Statistics} />
    </Switch>
  </div>
);

Dashboard.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Dashboard;