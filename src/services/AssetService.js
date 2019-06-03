import Service from './Service';
import uuid from 'uuid';
import { DB, Storage } from '../firebase';

class AssetService extends Service {
  constructor() {
    super();
    this.clear();
  }

  clear() {
    this.assets = {};
    this.modelMetadata = [];
    this.textureMetadata = [];
    this.mapMetadata = [];
  }

  async getModelMetadata() {
    const { modelMetadata } = this;

    if (modelMetadata && modelMetadata.length) {
      return modelMetadata;
    }

    const snapshot = await DB.collection('models').get();
    snapshot.forEach((doc) => {
      const model = doc.data();
      model.id = doc.id;
      this.modelMetadata.push(model);
    });

    return this.modelMetadata;
  }

  async getTextureMetadata() {
    const { textureMetadata } = this;

    if (textureMetadata && textureMetadata.length) {
      return textureMetadata;
    }

    const snapshot = await DB.collection('textures').get();
    snapshot.forEach((doc) => {
      const texture = doc.data();
      texture.id = doc.id;
      this.textureMetadata.push(texture);
    });

    return this.textureMetadata;
  }
}

export default new AssetService();