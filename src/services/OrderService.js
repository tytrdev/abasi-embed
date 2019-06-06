import Service from './Service';
import { DB } from '../firebase';
import _ from 'lodash';

class OrderService extends Service {
  constructor() {
    super();
    this.clear();
  }

  clear() {
    this.orders = [];
  }

  loadOrdersFromSnapshot(snapshot) {
    snapshot.forEach((doc) => {
      const order = doc.data();
      order.id = doc.id;
      this.orders.push(order);
    });
  }

  async create(data) {
    await DB.collection('orders').doc().set(data);
  }
}

export default new OrderService();