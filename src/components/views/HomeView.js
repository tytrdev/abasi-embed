import React from 'react';
import PropTypes from 'prop-types';

import MobileMenu from '../Sidebar';
import ViewPort from '../Viewport';
import Menu from '../Menu';
import Price from '../Price';

export default class HomeView extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.changeMode = this.changeMode.bind(this);
  }

  handleChange(data, key) {
    this.props.setData(data, key);
  }

  changeMode(mode) {
    this.props.changeMode(mode);
  }

  render() {
    const visibility = this.props.loading ? 'hidden' : 'visible';

    const style = {
      visibility,
    };

    return (
      <div className="flex home">
        <div className="home-viewport">
          <ViewPort
            price={this.props.price}
            handlePrice={this.props.handlePrice}
          />
        </div>

        <div className="home-menu" style={style}>
          <Menu
            items={this.props.items}
            columns
            renderer={this.props.renderer}
            callback={this.props.makeSelection}
            uuids={this.props.uuids}
            setUuids={this.props.setUuids}
            selections={this.props.selections}
          />

          <button type="button" className="review-btn" onClick={this.props.handlePrice} style={style}>
            <i className="fa fa-shopping-cart"></i>
            Review Order
          </button>

          <div className="price-btn" style={style}>  
            <Price price={this.props.price} handlePrice={this.props.handlePrice} />
          </div>
        </div>

        <div className="home-menu-mobile">
          <MobileMenu
            items={this.props.items}
            columns
            renderer={this.props.renderer}
            callback={this.props.makeSelection}
            uuids={this.props.uuids}
            setUuids={this.props.setUuids}
            selections={this.props.selections}
            price={this.props.price}
            handlePrice={this.props.handlePrice}
          />
        </div>
      </div>
    );
  }
}

HomeView.propTypes = {
  makeSelection: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  renderer: PropTypes.object.isRequired,
  price: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  handlePrice: PropTypes.func.isRequired,
  selections: PropTypes.object.isRequired,
};
