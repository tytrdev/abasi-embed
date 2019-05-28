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

  async getOrders() {
    const snapshot = await DB.collection('orders').get();
    this.loadOrdersFromSnapshot(snapshot);
  }

  async getAll() {
    const { orders } = this;

    if (!orders || !orders.length) {
      await this.getOrders();
    }

    return this.orders;
  }

  async get(id) {
    let order = _.find(this.orders, o => o.id === id);

    if (!order) {
      const doc = await DB.collection('orders').doc(id).get();
      order = doc.data();
      order.id = id;
      this.orders.push(order);
    }
    
    return order;
  }

  async create(data) {
    console.log(data);
    await DB.collection('orders').doc().set(data);
  }

  async updateNotes(order) {
    await DB.collection('orders').doc(order.id).set(order);
  }
}

export default new OrderService();