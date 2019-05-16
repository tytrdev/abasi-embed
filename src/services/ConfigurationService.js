import Service from './Service';
import { DB } from '../firebase';
import _ from 'lodash';
import uuid from 'uuid';

class ConfigurationService extends Service {
  constructor() {
    super();
    this.clear();
  }

  clear() {
    this.config = [];
  }

  loadConfigFromSnapshot(snapshot) {
    this.clear();

    snapshot.forEach((doc) => {
      const config = doc.data();
      config.id = doc.id;
      this.config.push(config);
    });

    return this.config;
  }

  async getConfig() {
    const snapshot = await DB.collection('configuration').get();
    return this.loadConfigFromSnapshot(snapshot);
  }

  async getAll() {
    const { config } = this;

    if (!config || !config.length) {
      await this.getConfig();
    }

    return this.config;
  }

  async get(id) {
    let config = _.find(this.config, c => c.id === id);

    if (!config) {
      const doc = await DB.collection('configuration').doc(id).get();
      config = doc.data();
      config.id = id;
      this.config.push(config);
    }
    
    return config;
  }

  async create(data) {
    if (data.id && typeof data.id === 'string' && data.id !== '') {
      await DB.collection('configuration').doc(data.id).set(data);
      this.config = _.filter(this.config, c => c.id !== data.id);
      this.config.push(data);
      return this.config;
    }

    delete data.id;
    await DB.collection('configuration').doc().set(data);
    this.config.push(data);
    return this.config;
  }

  async saveAll(configs) {
    try {
      _.each(configs, async c => {
        await DB.collection('configuration').doc(c.id).set(c);
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  createLineitem(config, item) {
    item.id = uuid.v4().replace(/-/g, '');

    if (config.options && config.options.length) {
      config.options.push(item);
    } else {
      config.options = [item];
    }
  }

  async delete(id) {
    await DB.collection('configuration').doc(id).delete();
  }
}

export default new ConfigurationService();