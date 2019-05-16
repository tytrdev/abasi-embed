import React from 'react';
import { ClipLoader } from 'react-spinners';
import Chart from './Chart'
import OrderService from '../../services/OrderService';

class Statistics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      orders: undefined,
    };
  }

  async componentDidMount() {
    const orders = await OrderService.getAll();

    this.setState({
      orders,
      loading: false,
    });
  }
  
  render() {
    const { loading, orders } = this.state;

    if (loading) {
      return (
        <div className="abasi-stats flex columns">
          <ClipLoader />
          <p>Loading orders...</p>
        </div>
      )
    }

    return (
      <div className="abasi-stats flex columns">
        <h1>Abasi Order Statistics</h1>

        <Chart data={orders}/>
      </div>
    );
  }
}

export default Statistics;
