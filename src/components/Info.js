import React from 'react';
import _ from 'lodash';

export default class Info extends React.Component {
  constructor(props) {
    super(props);

    this.getSelectionContent = this.getSelectionContent.bind(this);
  }

  getSelectionContent(key, title, index) {
    const selection = _.find(this.props.data, (v, k) => {
      return k === key;
    });

    return (
      <div className="configurator-selection" key={`selection-${key}`}>
        <div className="index">
          { index }.
        </div>

        <div className="title">
          { title }
        </div>

        <div className="name">
          {selection.name}
        </div>

        <div className="price">
          ${selection.price} USD
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="flex columns configurator-info">
        <h1>Order Confirmation</h1>

        <div className="configurator-selection">
          <div className="index"></div>
          <div className="title">Line Item</div>
          <div className="name">Selection</div>
          <div className="price">Price</div>
        </div>

        { this.getSelectionContent('body', 'Body Style', 1) }
        { this.getSelectionContent('body-wood', 'Body Wood', 2) }
        { this.getSelectionContent('neck', 'Neck Wood', 3) }
        { this.getSelectionContent('fingerboard', 'Fingerboard Material', 4) }
        { this.getSelectionContent('sidedots', 'Inlay Material', 5) }
        { this.getSelectionContent('hardware', 'Hardware Style', 6) }
        { this.getSelectionContent('battery', 'Battery Style', 7) }
        { this.getSelectionContent('pickups', 'Pickup Covers', 8) }
        { this.getSelectionContent('finish', 'Finish', 9) }

        <button type="button" onClick={this.props.submitOrder} className="submit-order-button">
          Submit Order
        </button>
      </div>
    );
  }
}
