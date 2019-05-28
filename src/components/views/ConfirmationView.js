import React from 'react';
import PropTypes from 'prop-types';

import Info from '../Info';

export default class ConfirmationView extends React.Component {
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
        <div className="container columns">
          <div className="back-button">
            <button className="back-to-order" onClick={this.props.handleMain}>
              <i className="fa fa-times"></i>
            </button>
          </div>

          <div className="container option-info">
            <Info data={this.props.data} price={this.props.price} submitOrder={this.props.handleOrder} />
          </div>
        </div>
      </div>
    );
  }
}

ConfirmationView.propTypes = {
  getItems: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  handleMain: PropTypes.func.isRequired,
  handleOrder: PropTypes.func.isRequired,
};
