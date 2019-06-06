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
    const bodyPrice = _.find(this.props.data, (v, k) => k === 'body').price;

    return (
      <div className="flex columns configurator-info">
        <h1>Order Confirmation</h1>

        <h3>Larada 8 String Multiscale - ${bodyPrice} USD</h3>

        <div className="configurator-selection">
          <div className="index"></div>
          <div className="title">Line Item</div>
          <div className="name">Selection</div>
          <div className="price">Price</div>
        </div>

        { this.getSelectionContent('body-wood', 'Body Wood', 1) }
        { this.getSelectionContent('neck', 'Neck Wood', 2) }
        { this.getSelectionContent('fingerboard', 'Fingerboard Material', 3) }
        { this.getSelectionContent('sidedots', 'Side Dot Material', 4) }
        { this.getSelectionContent('hardware', 'Hardware Style', 5) }
        { this.getSelectionContent('pickup-covers', 'Pickup Covers', 6) }
        { this.getSelectionContent('finish', 'Finish', 7) }
        { this.getSelectionContent('battery', 'Battery Style', 8) }

        <button type="button" onClick={this.props.submitOrder} className="submit-order-button">
          Continue to Order Submission
        </button>
      </div>
    );
  }
}
