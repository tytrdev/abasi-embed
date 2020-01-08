import OBJLoader from 'three-obj-loader';

const Three = require('three');

OBJLoader(Three);

class Materials {
  static envMap() {
    const path = '/';
    const format = '.jpg';
    const urls = [
      `${path}px${format}`, `${path}nx${format}`,
      `${path}py${format}`, `${path}ny${format}`,
      `${path}pz${format}`, `${path}nz${format}`,
    ];

    return new Three.CubeTextureLoader().load(urls);
  }

  static metalWithColor(reflectionCube, color) {
    return new Three.MeshStandardMaterial({
      color,

      roughness: 0.4,
      metalness: 0.5,

      envMap: reflectionCube, // important -- especially for metals!

      aoMapIntensity: 1.0,
      envMapIntensity: 0.7,
      // displacementScale: 2.436143, // from original model
      normalScale: 1.0,

      // flatShading: false,
    });
  }

  static metalWithoutColor(reflectionCube) {
    return new Three.MeshStandardMaterial({
      roughness: 0.3,
      metalness: 0.5,

      envMap: reflectionCube, // important -- especially for metals!

      aoMapIntensity: 1.0,
      envMapIntensity: 1.0,
      // displacementScale: 2.436143, // from original model
      normalScale: 1.0,

      // flatShading: false,
    });
  }

  static withColor(reflectionCube, color) {
    return new Three.MeshStandardMaterial({
      color,
      envMap: reflectionCube,
      roughness: 0.6,
      metalness: 0.5,
      aoMapIntensity: 0.8,
      envMapIntensity: 0.8,
      flatShading: false,
    });
  }

  static withoutColor(reflectionCube) {
    return new Three.MeshStandardMaterial({
      envMap: reflectionCube,
      roughness: 0.6,
      metalness: 0.5,
      aoMapIntensity: 0.8,
      envMapIntensity: 0.8,
      flatShading: false,
    });
  }

  static artSeries(reflectionCube, color) {
    return new Three.MeshStandardMaterial({
      color,

      roughness: 0.4,
      metalness: 0.4,

      envMap: reflectionCube, // important -- especially for metals!

      aoMapIntensity: 1.0,
      envMapIntensity: 0.7,
      // displacementScale: 2.436143, // from original model
      normalScale: 1.0,

      // flatShading: false,
    });
  }

  static loadTexture(path, loader, renderer) {
    console.log(path);
    const texture = loader.load(path);
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    // texture.anisotropy = 16;
    texture.wrapS = texture.wrapT = Three.MirroredRepeatWrapping;
    texture.minFilter = texture.magFilter = Three.LinearMipMapLinearFilter;
    return texture;
  }
}

export default Materials;
