import React from 'react';
import PropTypes from 'prop-types';

const SuccessView = ({ price, depositPrice, submit, handleMain }) => (
  <div className="container success-view">
    <h1>Thank you for your order!</h1>

    <p>Your receipt and order confirmation has been emailed to you.</p>

    <p>
      If you have any questions please contact 

      <a className="support-link" href="mailto:ivan@abasiguitars.com">Ivan</a>

      from Abasi Guitars.
    </p>

    <p>
      Amount Paid: ${depositPrice} USD
    </p>
  </div>
);

SuccessView.propTypes = {
  submit: PropTypes.func.isRequired,
};

export default SuccessView;
