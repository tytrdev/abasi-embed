import React from 'react';
import PropTypes from 'prop-types';

const Price = ({ price, handlePrice }) => (
  <div className="container evenly price-container">
    <div>
      <span className="price space-right">${price}</span>

      <i className="fa fa-question-circle price-icon tooltip" role="presentation" onClick={handlePrice}>
        <span className="tooltiptext">Click me for line item explanation of price</span>
      </i>
    </div>
  </div>
);

Price.propTypes = {
  handlePrice: PropTypes.func.isRequired,
  price: PropTypes.number.isRequired,
};

export default Price;
