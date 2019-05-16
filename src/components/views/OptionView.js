import React from 'react';
import PropTypes from 'prop-types';

import ViewPort from '../Viewport';
import Menu from '../Menu';
import Info from '../Info';

export default class OptionView extends React.Component {
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
    return (
      <div className="container">
        <div className="container option-menu">
          <div className="back-button">
            <button className="btn" onClick={this.props.goBack}>
              Back
            </button>
          </div>

          <Menu
            items={this.props.getItems()}
            setData={this.handleChange}
            changeMode={this.changeMode}
            columns
          />
        </div>

        <div className="container columns">
          <div className="container option-viewport">
            <ViewPort
              data={this.props.data}
              setData={this.handleChange}
              changeMode={this.changeMode}
            />
          </div>

          <div className="container option-info">
            <Info
              data={this.props.data}
              setData={this.handleChange}
              changeMode={this.changeMode}
            />
          </div>
        </div>
      </div>
    );
  }
}

OptionView.propTypes = {
  setData: PropTypes.func.isRequired,
  getItems: PropTypes.func.isRequired,
  changeMode: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
};
