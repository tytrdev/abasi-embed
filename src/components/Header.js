import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../actions/auth';

const Header = ({ user, logout }) => (
  <div className="app-bar">
    <Link to="/" className="brand-logo">
      <img src="/logo.png" alt="Abasi Logo" />
    </Link>

    {user && (
      <span className="app-actions">
        <span className="active-user">
          {user.email}
        </span>
        
        <button className="abasi-logout" onClick={logout}>
          Logout
        </button>
      </span>
    )}
  </div>
);

Header.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
};

export default connect(
  null,
  actions,
)(Header);
