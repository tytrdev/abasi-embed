import React from 'react';
import PropTypes from 'prop-types';

const Price = ({ price, handlePrice }) => (
  <div className="container evenly price-container">
    <div>
      <span className="price space-right">${price}</span>
    </div>
  </div>
);

Price.propTypes = {
  handlePrice: PropTypes.func.isRequired,
  price: PropTypes.number.isRequired,
};

export default Price;
