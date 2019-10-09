import React from 'react';
import { slide as Slide } from 'react-burger-menu';

import Menu from './Menu';

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
      <Slide
        isOpen={this.state.open}
        pageWrapId="app-body"
        outerContainerId="app-container"

      >
        <Menu
          columns
          mobile
          items={this.props.items}
          renderer={this.props.renderer}
          callback={this.props.callback}
          uuids={this.props.uuids}
          setUuids={this.props.setUuids}
          selections={this.props.selections}
        />
      </Slide>
    );
  }
}

export default Sidebar;
