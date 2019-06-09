import React from 'react';
import Configurator from './Configurator';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter as Router, Route, Switch, withRouter,
} from 'react-router-dom';
import {StripeProvider} from 'react-stripe-elements';

import Welcome from './Welcome';

// Styles
import '../styles/app.scss';

const App = () => (
  <StripeProvider apiKey="pk_test_lnRXcSkX6q4yXi2LMXXZxGsK">
    <Router>
      <div id="app-container" className="flex columns">
        {/* Notification Container */}
        <ToastContainer
          className='toast-container'
          toastClassName="dark-toast"
          progressClassName='toast-progress'
          position="bottom-center"
        />

        <div id="app-body" className="flex app-body">
          <Switch>
            <Route exact path="/:type" render={props => <Configurator {...props} />} />
            <Route component={Welcome} />
          </Switch>
        </div>
      </div>
    </Router>
  </StripeProvider>
);

export default withRouter(App);
