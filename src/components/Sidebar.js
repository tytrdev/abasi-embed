import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle(e) {
    e.preventDefault();
    this.setState({
      open: !this.state.open,
    });
  }

  showSettings(event) {
    event.preventDefault();
  }

  render() {
    return (
      <Menu
        isOpen={this.state.open}
        pageWrapId={ 'app-body' }
        outerContainerId={ 'app-container' }
        disableAutoFocus 
      >
        <Link to="/" className="menu-logo">
          <img src="/logo.png" alt="Abasi Logo" />
        </Link>

        <Link to="/">
          Home
        </Link>

        <Link to="/orders">
          Orders
        </Link>

        <Link to="/assets">
          Asset Management
        </Link>

        <Link to="/config">
          Configuration Management
        </Link>

        <Link to="/statistics">
          Order Statistics
        </Link>

        {/* <a onClick={ this.showSettings } className="menu-item--small" href="">Settings</a> */}
      </Menu>
    );
  }
}

export default Sidebar;
