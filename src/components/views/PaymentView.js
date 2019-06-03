import React from 'react';
import PropTypes from 'prop-types';

import ViewPort from '../Viewport';
import Menu from '../Menu';
import Info from '../Info';

export default class PaymentView extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <div className="payment-view">
        Payment stuff goes here
      </div>
    );
  }
}

PaymentView.propTypes = {
  setData: PropTypes.func.isRequired,
  getItems: PropTypes.func.isRequired,
  changeMode: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
};
