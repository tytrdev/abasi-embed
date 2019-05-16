import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../actions/auth';

class Welcome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
  }

  login(event) {
    this.props.login(this.state.email, this.state.password);
    event.preventDefault();
  }

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <div className="flex columns abasi-login">
        <h1 className="login-header">Login</h1>

        <form onSubmit={this.login}>
          <div className="flex columns">
            <input className="abasi-input"
              type="text"
              name="email"
              placeholder="Email"
              value={this.state.email} 
              onChange={this.handleChange}
            />

            <input className="abasi-input"
              type="password"
              name="password"
              placeholder="Password"
              value={this.state.password} 
              onChange={this.handleChange}
            />

            <button type="submit" className="btn abasi-login-button">
              Login
            </button>
          </div>
        </form>
      </div>
    );
  }
}

Welcome.propTypes = {
  login: PropTypes.func.isRequired,
};

export default withRouter(connect(
  null,
  actions,
)(Welcome));
