import React from 'react';
import PropTypes from 'prop-types';

export default class Viewport extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(data) {
    this.props.setData(data);
  }

  mountRenderer(element) {
    this.containerRef.appendChild(element);
  }

  render() {
    return (
      <div className="viewport">
        <div id="renderer-container" className="viewport-view" />
      </div>
    );
  }
}

Viewport.propTypes = {
  price: PropTypes.number.isRequired,
  handlePrice: PropTypes.func.isRequired,
};

