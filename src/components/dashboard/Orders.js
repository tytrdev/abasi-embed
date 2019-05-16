import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import OrderService from '../../services/OrderService';
import { ClipLoader } from 'react-spinners';

class Orders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: null,
    };

    this.getOrders();
  }

  async getOrders() {
    const orders = await OrderService.getAll();
    this.setState({
      orders,
    });
  }

  getOrderContent(order) {
    return (
      <tr className="abasi-orders-row">
        <td>{ order.orderNumber }</td>
        <td>{ order.id }</td>
        <td>${ order.total }</td>
        <td>{ order.status }</td>

        <td>
          <Link to={`/orders/${order.id}`}>
            View Order
          </Link>
        </td>
      </tr>
    );
  }

  getDefaultContent() {
    return (
      <div className="flex columns abasi-orders-spinner">
        <h1>Retrieving Orders</h1>
        <ClipLoader />
      </div>
    );
  }

  getOrdersContent(orders) {
    const orderContent = _.map(orders, this.getOrderContent);

    return (
      <div className="abasi-orders flex columns">
        <span className="abasi-orders-header">
          Orders
        </span>
  
        <table className="abasi-orders-table abasi-table" border="1" frame="void" rules="rows">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Invoice ID</th>
              <th>Total</th>
              <th>Payment Status</th>
              <th>Order Link</th>
            </tr>
          </thead>
  
          <tbody>
            { orderContent }
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    const { orders } = this.state;

    if (orders) {
      return this.getOrdersContent(orders);
    }
    
    return this.getDefaultContent();
  }
}

export default Orders;