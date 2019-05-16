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

    this.TEXTURE_ANISOTROPY = 16;

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
    this.renderer = new Three.WebGLRenderer({ alpha: true, antialias: true });
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
    this.darkMetalMaterial = Materials.metalWithColor(reflectionCube, 0x222222);
    this.blackMetalMaterial = Materials.metalWithColor(reflectionCube, 0x272222);
    this.lighterMetalMaterial = Materials.metalWithColor(reflectionCube, 0x333333);

    this.brownMaterial = Materials.withColor(reflectionCube, 0x272222);
    this.whiteMaterial = Materials.metalWithColor(reflectionCube, 0xDFDCDC);
  }

  getRendererElement() {
    return this.renderer.domElement;
  }

  async createScene() {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.scene = new Three.Scene();
    this.camera = new Three.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 200);

    // Setup controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1;
    this.controls.maxDistance = 150;
    this.controls.minDistance = 50;
    this.controls.panSpeed = 0;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    
    const ambient = new Three.AmbientLight( 0xffffff, 1.0 );
    this.scene.add( ambient );

    const light = new Three.HemisphereLight( 0xffffff, 0xffffff, 0.5);
    this.scene.add(light);

    const frontLight = new Three.DirectionalLight( 0xffffff, 1, 100);
    frontLight.position.set(0, 0, -40);
    frontLight.lookAt(0, 0, 0);
    this.frontLight = frontLight;
    this.scene.add(frontLight);

    const leftLight = new Three.DirectionalLight( 0xffffff, 0.5);
    leftLight.position.set(-10, 0, -20);
    leftLight.lookAt(0, 0, 0);
    this.leftLight = leftLight;
    this.scene.add(leftLight);

    const rightLight = new Three.DirectionalLight( 0xffffff, 0.5);
    rightLight.position.set(10, 0, -20);
    rightLight.lookAt(0, 0, 0);
    this.rightLight = rightLight;
    this.scene.add(rightLight);

    const backLight = new Three.DirectionalLight( 0xffffff, 0.5);
    backLight.position.set(0, 0, 40);
    backLight.lookAt(0, 0, 0);
    this.backLight = backLight;
    this.scene.add(backLight);

    window.addEventListener('resize', this.resize, false);

    // Begin animation loop
    this.animate();
  }

  resize() {
    console.log(this.container.clientWidth);
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
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
        // child.geometry.computeVertexNormals(true);
        console.log(child.name);

        switch (child.name) {
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
          case 'Strings':
          case 'String_ends':
          case 'Tuners':
          case 'FRETS001':
          case 'Screws001':
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

        child.geometry.computeVertexNormals(true);
      }


      // console.log(child);
    });

    // model.scale.x = 0.5;
    // model.scale.y = 0.5;
    // model.scale.z = 0.5;

    model.rotation.y = Math.PI;
    console.log(model.position, 'position');
    this.scene.add(model);
  }

  // Configurator utilities for selections
  async selectModel(selection, key) {
    console.log(this.modelLoader);
    console.log('Configuring new model', selection);
    const model = _.find(this.assets.models, m => m.id === selection.asset);
    // const response = await Axios.get(model.location, { responseType: 'arraybuffer' });
    // const fbxScene = await this.modelLoader.parse(response.data);
    console.log(model);

    await new Promise((resolve, reject) => {
      try {
        this.modelLoader.load(model.location, obj => {
          console.log(obj);
          this.prepareModel(obj);
  
          resolve('Success');
        }, (progress) => this.updatePercent((progress.loaded / progress.total * 100)), true, false);
      } catch (ex) {
        console.log(ex);
      }
    })
  }

  async selectMaterial(selection, key) {
    console.log('Configuring new material', selection);

    const layerKey = LayerMap[key];

    console.log(layerKey);

    this.models.current.traverse((child) => {
      console.log(child);
      if (child instanceof Three.Mesh && layerKey.indexOf(child.name) !== -1) {
        console.log('Updating layer with texture!');

        // child.material.color.setHex(colorToSigned24Bit(selection.color));

        child.material = Materials.metalWithColor(this.reflectionCube, colorToSigned24Bit(selection.color));
      }
    });
  }

  async selectTexture(selection, key) {
    const asset = _.find(this.assets.textures, t => t.id === selection.asset);
    const texture = Materials.loadTexture(asset.location, this.textureLoader, this.renderer);

    const layerKey = LayerMap[key];

    this.models.current.traverse((child) => {
      if (child instanceof Three.Mesh && (child.name === layerKey || layerKey.indexOf(child.name) !== -1)) {
        child.material = Materials.metalWithoutColor(this.reflectionCube);
        child.material.map = texture;
      }
    });
  }

  async selectFinish(selection, key) {
    console.log('Configuring new Finish', selection);

    const layerKey = LayerMap[key];

    this.models.current.traverse((child) => {
      if (child instanceof Three.Mesh && (child.name === layerKey || layerKey.indexOf(child.name) !== -1)) {
        if (selection.transparent) {
          const oldMaterial = child.material;
          
          child.material = Materials.metalWithColor(this.reflectionCube, colorToSigned24Bit(selection.color));
          child.material.map = oldMaterial.map;
          console.log('Creating new transparent texture layer');
        } else {
          child.material = Materials.metalWithColor(this.reflectionCube, colorToSigned24Bit(selection.color));
        }
      }
    });
  }
}
