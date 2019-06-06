import React from 'react';
import PropTypes from 'prop-types';
import {Elements} from 'react-stripe-elements';

import CheckoutForm from './CheckoutForm';

const PaymentView = ({ price, submit }) => (
  <div className="container checkout">
    <div className="price">
      Order Total - ${price}
    </div>

    <Elements>
      <CheckoutForm
        submit={submit}
      />
    </Elements>
  </div>
);

PaymentView.propTypes = {
  submit: PropTypes.func.isRequired,
};

export default PaymentView;
