import Dexie from 'dexie';

class Storage {
  constructor(database) {
    this.db = new Dexie(database);

	  // Declare tables, IDs and indexes
    this.db.version(1).stores({
      models: '++id, name, data'
    });
  }

  async put(key, data) {
    const raw = JSON.stringify(data);

    await this.db.models.add({
      name: key,
      data: raw,
    });
  }

  async get(key) {
    const models = await this.db.models.where('name').equals(key).toArray();

    if (models && models.length) {
      return JSON.parse(models[0].data);
    } else if (models && (!models.length && !models.length === 0)) {
      // Actually models here
      return JSON.parse(models);
    }
    
    return null;
  }
}

export default new Storage('AbasiConfigurator');