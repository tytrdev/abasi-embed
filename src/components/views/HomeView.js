import React from 'react';
import PropTypes from 'prop-types';

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
    return (
      <div className="flex home">
        <div className="home-viewport">
          <ViewPort
            price={this.props.price}
            handlePrice={this.props.handlePrice}
          />
        </div>

        {!this.props.loading &&
          <div className="home-menu">
            <Menu
              items={this.props.getItems()}
              columns
              renderer={this.props.renderer}
              callback={this.props.makeSelection}
            />

            {/* <button type="button" className="review-btn" onClick={this.props.handlePrice}>
              <i className="fa fa-shopping-cart"></i>
              Review Order
            </button>

            <div className="price-btn">  
              <Price price={this.props.price} handlePrice={this.props.handlePrice} />
            </div> */}
          </div>
        }
      </div>
    );
  }
}

HomeView.propTypes = {
  makeSelection: PropTypes.func.isRequired,
  getItems: PropTypes.func.isRequired,
  renderer: PropTypes.object.isRequired,
  price: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  canGoBack: PropTypes.bool.isRequired,
  goBack: PropTypes.func.isRequired,
  handlePrice: PropTypes.func.isRequired,
};
