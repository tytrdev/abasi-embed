import React from 'react';
import PropTypes from 'prop-types';
import H2P from 'html2pdf.js';

import MobileMenu from '../Sidebar';
import ViewPort from '../Viewport';
import Menu from '../Menu';

export default class HomeView extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.changeMode = this.changeMode.bind(this);
  }

  handleChange(data, key) {
    this.props.setData(data, key);
  }

  changeMode(mode) {
    this.props.changeMode(mode);
  }

  render() {
    const visibility = this.props.loading ? 'hidden' : 'visible';

    const style = {
      visibility,
    };

    return (
      <div className="flex home">
        <div className="home-viewport">
          <ViewPort />
        </div>

        <div className="home-menu" style={style}>
          <Menu
            items={this.props.items}
            columns
            renderer={this.props.renderer}
            callback={this.props.makeSelection}
            uuids={this.props.uuids}
            setUuids={this.props.setUuids}
            selections={this.props.selections}
          />

          <button type="button" className="review-btn" onClick={this.props.handleScreenshot} style={style}>
            <i className="fa fa-camera" />
            Take Screenshot
          </button>

        </div>

        <div className="home-menu-mobile">
          <MobileMenu
            columns
            items={this.props.items}
            renderer={this.props.renderer}
            callback={this.props.makeSelection}
            uuids={this.props.uuids}
            setUuids={this.props.setUuids}
            selections={this.props.selections}
          />
        </div>
      </div>
    );
  }
}

HomeView.propTypes = {
  makeSelection: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  renderer: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  selections: PropTypes.object.isRequired,
};
