import React from 'react';
import PropTypes from 'prop-types';
import {Elements} from 'react-stripe-elements';

import CheckoutForm from './CheckoutForm';

const PaymentView = ({ price, depositPrice, submit, handleMain }) => (
  <div className="container checkout">
    <div className="back-button">
      <button className="back-to-order" onClick={handleMain}>
        <i className="fa fa-times"></i>
      </button>
    </div>

    <div className="price">
      Order Total - ${price} <br />
      Deposit Total - ${depositPrice} (35%)
    </div>

    <Elements>
      <CheckoutForm
        submit={submit}
        depositPrice={depositPrice}
      />
    </Elements>
  </div>
);

PaymentView.propTypes = {
  submit: PropTypes.func.isRequired,
};

export default PaymentView;
