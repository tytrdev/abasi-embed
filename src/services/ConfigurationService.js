import Service from './Service';
import { DB } from '../firebase';
import _ from 'lodash';

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
}

export default new ConfigurationService();