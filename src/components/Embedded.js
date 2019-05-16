import React from 'react';
import PropTypes from 'prop-types';
import Configurator from './Configurator';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter as Router, Route, Switch, withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';

// App Components
import Header from './Header';
import Sidebar from './Sidebar';
import Welcome from './Welcome';
import Dashboard from './dashboard/Dashboard';

// Styles
import '../styles/app.css';

// Redux actions
import * as actions from '../actions/auth';

const Embedded = ({
  user,
}) => {
  const localUser = localStorage.getItem('user');
  const authedUser = user || JSON.parse(localUser);
  actions.initUser();

  user = user || authedUser;

  return (
    <Router>
      <div id="app-container" className="flex columns">
        {/* Notification Container */}
        <ToastContainer
          className='toast-container'
          toastClassName="dark-toast"
          progressClassName='toast-progress'
        />

        <Header user={user} />

        { user &&
          <Sidebar />
        }

        <div className="flex app-body">
          {!user &&
            <Welcome />
          }

          {user &&
            <Switch>
              <Route exact path="/embed" component={Configurator} />
              <Route path="/" render={props => <Dashboard {...props} user={user} />} />
            </Switch>
          }
        </div>
      </div>
    </Router>
  );
};

Embedded.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default withRouter(connect(
  mapStateToProps,
  actions,
)(Embedded));
