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
        <p>Would you like to complete the purchase?</p>

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
};

export default injectStripe(CheckoutForm);
