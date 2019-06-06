import React from 'react';
import PropTypes from 'prop-types';

export default class CustomerView extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.submitOrder = this.submitOrder.bind(this);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      address1: '',
      address2: '',
      country: '',
      state: '',
      postalCode: '',
      notes: '',
    };
  }

  submitOrder(event) {
    event.preventDefault();

    this.props.handlePayment(this.state);
  }

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  }

  changeMode(mode) {
    this.props.changeMode(mode);
  }

  render() {
    return (
      <div className="container">
        <div className="container columns">
          <div className="back-button">
            <button className="back-to-order" onClick={this.props.handleMain}>
              <i className="fa fa-times"></i>
            </button>
          </div>

          <div className="container customer-info">
            <div className="price">
              Order Total - ${this.props.price} <br />
              Deposit Total - ${this.props.depositPrice} (35%)
            </div>

            <h1>Customer Information</h1>
            <h3>Please fill out this information accurately</h3>

            <form onSubmit={this.submitOrder}>
              <label htmlFor="firstName">
                <span className="label">First Name:</span>

                <input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  onChange={this.handleChange}
                  value={this.state.firstName}
                  required
                />
              </label>

              <label htmlFor="lastName">
                <span className="label">Last Name:</span>

                <input
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  onChange={this.handleChange}
                  value={this.state.lastName}
                  required
                />
              </label>
              
              <label htmlFor="email">
                <span className="label">Email:</span>

                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  onChange={this.handleChange}
                  value={this.state.email}
                  required
                />
              </label>

              <label htmlFor="address1">
                <span className="label">Address 1:</span>
                
                <input
                  type="text"
                  placeholder="Address 1"
                  name="address1"
                  onChange={this.handleChange}
                  value={this.state.address1}
                  required
                />
              </label>

              <label htmlFor="address2">
                <span className="label">Address 2:</span>

                <input
                  type="text"
                  placeholder="Address 2 (optional)"
                  name="address2"
                  onChange={this.handleChange}
                  value={this.state.address2}
                />
              </label>

              <label htmlFor="city">
                <span className="label">City:</span>

                <input
                  type="text"
                  placeholder="City"
                  name="city"
                  onChange={this.handleChange}
                  value={this.state.city}
                  required
                />
              </label>

              <label htmlFor="state">
                <span className="label">State:</span>

                <input
                  type="text"
                  placeholder="State"
                  name="state"
                  onChange={this.handleChange}
                  value={this.state.state}
                  required
                />
              </label>

              <label htmlFor="postalCode">
                <span className="label">Postal Code:</span>
                
                <input
                  type="text"
                  placeholder="Postal Code"
                  name="postalCode"
                  onChange={this.handleChange}
                  value={this.state.postalCode}
                  required
                />
              </label>

              <label htmlFor="notes">
                <span className="label">Notes:</span>
                
                <textarea
                  type="text"
                  placeholder="Type anything you would like to tell the builders here"
                  name="notes"
                  onChange={this.handleChange}
                  value={this.state.notes}
                />
              </label>
              
              <button type="submit" className="submit-order-button">
                Continue To Payment
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

CustomerView.propTypes = {
  getItems: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  handleMain: PropTypes.func.isRequired,
  handlePayment: PropTypes.func.isRequired,
};
