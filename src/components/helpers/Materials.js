import OBJLoader from 'three-obj-loader';
const Three = require('three');

OBJLoader(Three);

class Materials {
  static envMap() {
    const path = "/";
    var format = '.jpg';
    var urls = [
      path + 'px' + format, path + 'nx' + format,
      path + 'py' + format, path + 'ny' + format,
      path + 'pz' + format, path + 'nz' + format
    ];

    return new Three.CubeTextureLoader().load(urls);
  }

  static metalWithColor(reflectionCube, color) {
    return new Three.MeshStandardMaterial( {
      color: color,
  
      roughness: 0,
      metalness: 0.5,
  
      envMap: reflectionCube, // important -- especially for metals!
      
      aoMapIntensity: 1.0,
      envMapIntensity: 1.0,
      // displacementScale: 2.436143, // from original model
      normalScale: 1.0,

      // flatShading: false,
    });
  }

  static metalWithoutColor(reflectionCube) {
    return new Three.MeshStandardMaterial( {
      roughness: 0,
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
    return new Three.MeshStandardMaterial( {
      color: color,
      envMap: reflectionCube,
  
      roughness: 0.8,
      metalness: 0.3,
      
      flatShading: false,
    });
  }

  static loadTexture(path, loader, renderer) {
    const texture = loader.load(path);
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.wrapS = texture.wrapT = Three.MirroredRepeatWrapping;
    texture.minFilter = texture.magFilter = Three.LinearFilter;
    return texture;
  }
}

export default Materials;
