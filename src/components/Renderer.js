import OBJLoader from 'three-obj-loader';
import OrbitControls from 'three-orbitcontrols';
import FBXLoader from 'three-fbxloader-offical';
import _ from 'lodash';
import Axios from 'axios';

import Events from '../constants/events';
import LayerMap from '../constants/layer-map';
import Materials from './helpers/Materials';
import { resolve } from 'dns';

const Three = require('three');

OBJLoader(Three);

function colorToSigned24Bit(s) {
  return (parseInt(s.substr(1), 16) << 8) / 256;
}

export default class Renderer {
  constructor(data, updatePercent) {
    this.updatePercent = updatePercent;

    Three.Cache.enabled = true;

    this.TEXTURE_ANISOTROPY = 32;

    this.data = data;

    // Event bindings
    this.animate = this.animate.bind(this);
    this.resize = this.resize.bind(this);
    this.createScene = this.createScene.bind(this);

    // Selection events
    this.selectModel = this.selectModel.bind(this);
    this.selectFinish = this.selectFinish.bind(this);
    this.selectTexture = this.selectTexture.bind(this);
    this.selectMaterial = this.selectMaterial.bind(this);

    // Need to set container on instance
    this.renderer = new Three.WebGLRenderer({ alpha: true, antialias: true, precision: 'highp' });
    // this.renderer.setClearColor(0x000000, 0.5);
    // this.renderer.setClearColor(0xffffff, 0);

    this.container = undefined;
    this.textureLoader = new Three.TextureLoader();
    this.modelLoader = new Three.OBJLoader();

    this.models = {};
    this.materials = {};
    this.textures = {};

    const reflectionCube = Materials.envMap();
    reflectionCube.encoding = Three.GammaEncoding;
    this.reflectionCube = reflectionCube;

    this.metalMaterial = Materials.metalWithColor(reflectionCube, 0x808080);
    this.satinMetalMaterial = Materials.withColor(reflectionCube, 0xBFC1C2);
    this.darkMetalMaterial = Materials.metalWithColor(reflectionCube, 0x222222);
    this.blackMetalMaterial = Materials.metalWithColor(reflectionCube, 0x272222);
    this.lighterMetalMaterial = Materials.metalWithColor(reflectionCube, 0x333333);

    this.brownMaterial = Materials.withColor(reflectionCube, 0x272222);
    this.whiteMaterial = Materials.withColor(reflectionCube, 0xD8D5D5);
  }

  getRendererElement() {
    return this.renderer.domElement;
  }

  async createScene() {
    this.scene = new Three.Scene();
    this.camera = new Three.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 200);

    // Setup controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1;
    this.controls.maxDistance = 80;
    this.controls.minDistance = 50;
    this.controls.panSpeed = 0;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    
    const ambient = new Three.AmbientLight( 0xffffff, 1.0 );
    this.scene.add( ambient );

    // const light = new Three.HemisphereLight( 0xffffff, 0xffffff, 0.3);
    // this.scene.add(light);


    const lightModifier = 20;
    const positions = [
      // [1, 1, 1, 0.3],
      [1, 1, -1, 0.3],
      // [1, -1, 1, 0.3],
      [1, -1, -1, 0.3],
      // [-1, 1, 1, 0.3],
      [-1, 1, -1, 0.3],
      // [-1, -1, 1, 0.1],
      [-1, -1, -1, 0.1],
    ];
    
    _.each(positions, data => {
      const light = new Three.DirectionalLight(0xffffff, data[3]);
      light.position.set(data[0] * lightModifier, data[1] * lightModifier, data[2] * lightModifier);
      light.lookAt(0, 0, 0);
      this.scene.add(light);
    });

    window.addEventListener('resize', this.resize, false);

    // Begin animation loop
    this.animate();
  }

  resize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight - 5);
  }

  /* eslint-disable no-param-reassign */
  setModel(model) {
    this.scene.remove(this.models.current);

    model.traverse((node) => {
      if (node.isMesh) {
        node.material.map = this.textures.current;
      }
    });

    this.models.current = model;
    this.scene.add(model);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderScene();
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
    this.animate();
  }

  prepareModel(model) {
    // TODO: Prepare model with actual stuff
    // This is really important
    if (this.models.current) {
      this.scene.remove(this.models.current);
    }

    this.models.current = model;

    model.traverse( child => {
      if ( child instanceof Three.Mesh ) {
        switch (child.name) {
          case 'Strings':
          case 'FRETS001':          
          case 'Screws001':
            child.material = this.satinMetalMaterial;
            break;
          case 'PICKUPS':
            child.material = this.whiteMaterial;
            break;
          case 'Strap_holder':
          case 'Bridge':
            child.material = this.blackMetalMaterial;
            break;
          case 'Fret_dots_Big_side':
          case 'Fret_Dots_Small_side':
          case 'Abasi_Logo':
          case 'Tuner_White_rubber':
            child.material = this.whiteMaterial;
            break;
          case 'String_ends':
          case 'Tuners':
            child.material = this.metalMaterial;
            break;
          case 'String_holder':
            child.material = this.metalMaterial;
            break;
          case 'BODY':
          case 'NECK':
            child.material = this.darkMetalMaterial;
            break;
          case 'FretBoard':
            child.material = this.brownMaterial;
            break;
          case 'Input_Jack_Bottom_Body':
          case 'Battery_Bottom':
            child.material = this.lighterMetalMaterial;
            break;
          default:
            child.material = this.blackMetalMaterial;
            break;
        }

        // child.geometry.computeVertexNormals(true);
      }
    });

    // model.scale.x = 0.8;
    // model.scale.y = 0.8;
    // model.scale.z = 0.8;
    model.rotation.y = Math.PI;
    this.scene.add(model);
  }

  // Configurator utilities for selections
  async selectModel(selection) {
    const model = _.find(this.assets.models, m => m.id === selection.asset);

    await new Promise((resolve, reject) => {
      try {
        this.modelLoader.load(model.location, obj => {
          this.prepareModel(obj);
          resolve('Success');
        }, (progress) => this.updatePercent((progress.loaded / progress.total * 100)), true, false);
      } catch (ex) {
        console.log(ex);
      }
    })
  }

  async selectMaterial(selection, key) {
    const layerKey = LayerMap[key];

    this.models.current.traverse((child) => {
      console.log(child);
      if (child instanceof Three.Mesh && layerKey.indexOf(child.name) !== -1) {
        if (selection.matte || child.name === 'PICKUPS') {
          child.material = Materials.withColor(this.reflectionCube, colorToSigned24Bit(selection.color));
        } else {
          child.material = Materials.metalWithColor(this.reflectionCube, colorToSigned24Bit(selection.color));
        }
      }
    });
  }

  async selectTexture(selection, key) {
    const asset = _.find(this.assets.textures, t => t.id === selection.asset);
    const texture = Materials.loadTexture(asset.location, this.textureLoader, this.renderer);

    const layerKey = LayerMap[key];

    this.models.current.traverse((child) => {
      if (child instanceof Three.Mesh && (child.name === layerKey || layerKey.indexOf(child.name) !== -1)) {
        if (selection.matte) {
          child.material = Materials.withoutColor(this.reflectionCube);
        } else {
          child.material = Materials.withoutColor(this.reflectionCube);
        }

        child.material.map = texture;
        this.bodyTexture = texture;

        if ((child.name === 'BODY' || child.name === 'Body_top') && this.bodyMaterial) {
          child.material = this.bodyMaterial;
          child.material.map = texture;
        }
      }
    });
  }

  async selectFinish(selection, key) {
    console.log('Configuring new Finish');

    const { type } = selection;
    let material;
    let outerMaterial;

    switch(type) {
      case 'standard':
        material = this.getStandardMaterial(selection);
        material.map = this.bodyTexture;
        outerMaterial = material;
        break;
      case 'premium':
        material = this.getPremiumMaterial(selection, true);
        outerMaterial = this.getPremiumMaterial(selection, false);
        break;
      case 'artseries':
        material = this.getArtSeriesMaterial(selection);
        outerMaterial = this.getPremiumMaterial(selection);
        break;
    }

    this.bodyMaterial = outerMaterial;

    if (material && outerMaterial) {
      const layerKey = LayerMap[key];
  
      this.models.current.traverse((child) => {
        // if (child instanceof Three.Mesh && (child.name === layerKey || layerKey.indexOf(child.name) !== -1)) {
        //   child.material = material;
        // }

        if (child.name === 'BODY') {
          child.material = outerMaterial;
        }

        if (child.name === 'Body_top') {
          child.material = material;
        }

        if (type === 'artseries' && (child.name === 'Battery_Bottom' || child.name === 'Input_Jack_Bottom_Body')) {
          child.material = material;
        }

        if (type === 'artseries' && child.name === 'Head_Top') {
          if (selection.name.toLowerCase().indexOf('light') === -1) {
            child.material = this.blackMetalMaterial;
          } else {
            child.material = this.whiteMaterial;
          }
        }
      });
    }
  }

  getStandardMaterial(selection) {
    // TODO: Preserve texture
    return Materials.withColor(this.reflectionCube, colorToSigned24Bit(selection.color));
  }

  getPremiumMaterial(selection, satin) {
    if (satin) {
      return Materials.withColor(this.reflectionCube, colorToSigned24Bit(selection.color));
    } else {
      return Materials.metalWithColor(this.reflectionCube, colorToSigned24Bit(selection.color));
    }
  }

  getArtSeriesMaterial(selection) {
    const asset = _.find(this.assets.textures, t => t.id === selection.asset);
    const texture = Materials.loadTexture(asset.location, this.textureLoader, this.renderer);

    const material = Materials.withoutColor(this.reflectionCube);
    material.map = texture;

    return material;
  }
}
