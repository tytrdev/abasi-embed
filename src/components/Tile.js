import React from 'react';
import PropTypes from 'prop-types';

export default class Tile extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.callback(this.props.data);
  }

  render() {
    const label = this.props.data.label || this.props.data.title || this.props.data.name;
    const { price } = this.props.data;
    const showPrice = price !== undefined;

    return (
      <div className="flex tile" role="presentation" onClick={this.handleClick}>
        <span className="tile-label">
          {label}
        </span>

        {showPrice &&
          <span className="tile-price">
            ${price} USD
          </span>
        }
      </div>
    );
  }
}

Tile.propTypes = {
  data: PropTypes.object.isRequired,
  callback: PropTypes.func.isRequired,
  imageSource: PropTypes.object,
};
