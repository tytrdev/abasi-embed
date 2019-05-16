import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Tile = ({ url, title }) => (
  <Link to={url}>
    <div className="abasi-tile">
      <span className="abasi-tile-label">
        { title }
      </span>
    </div>
  </Link>
);

Tile.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default Tile;
