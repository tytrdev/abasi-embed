import React from 'react';
import PropTypes from 'prop-types';
import {CardElement, injectStripe} from 'react-stripe-elements';

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    
    this.submit = this.submit.bind(this);
  }

  async submit(event) {
    event.preventDefault();
    const {token} = await this.props.stripe.createToken({name: "Name"});
    this.props.submit(token);
  }

  render() {
    return (
      <div className="checkout-form">
        <h1 className="header">Would you like to place this order?</h1>
        <p className="info">You will be paying a 35% deposit of ${this.props.depositPrice}</p>

        <CardElement />

        <button className="checkout-button" onClick={this.submit}>
          Submit Order
        </button>
      </div>
    )
  }
}

CheckoutForm.propTypes = {
  submit: PropTypes.func.isRequired,
  depositPrice: PropTypes.number.isRequired,
};

export default injectStripe(CheckoutForm);
