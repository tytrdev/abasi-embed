import FBXLoader from 'three-fbxloader-offical';
import OrbitControls from 'three-orbitcontrols';
import _ from 'lodash';

import Groups from '../constants/groups';
import Materials from './helpers/Materials';

const Three = require('three');

function colorToSigned24Bit(s) {
  return (parseInt(s.substr(1), 16) << 8) / 256;
}

const STANDARD = 'standard';
const TRANSPARENT = 'transparent';
const PREMIUM = 'premium';
const ARTSERIES = 'artseries';

export default class Renderer {
  constructor(updatePercent) {
    this.updatePercent = updatePercent;

    // Event bindings
    this.animate = this.animate.bind(this);
    this.resize = this.resize.bind(this);
    this.createScene = this.createScene.bind(this);

    // Selection events
    this.selectModel = this.selectModel.bind(this);
    this.selectFinish = this.selectFinish.bind(this);
    this.selectTexture = this.selectTexture.bind(this);
    this.selectMaterial = this.selectMaterial.bind(this);

    this.renderer = new Three.WebGLRenderer({ alpha: true, antialias: true, precision: 'highp' });

    this.container = undefined;
    this.textureLoader = new Three.TextureLoader();
    this.modelLoader = new FBXLoader();

    const reflectionCube = Materials.envMap();
    reflectionCube.encoding = Three.GammaEncoding;
    this.reflectionCube = reflectionCube;

    this.finishMode = STANDARD;

    this.models = {};
    this.textures = {};
    this.materials = {
      // Gloss Materials
      metalMaterial: Materials.metalWithColor(reflectionCube, 0x808080),
      darkMetalMaterial: Materials.metalWithColor(reflectionCube, 0x222222),
      blackMetalMaterial: Materials.metalWithColor(reflectionCube, 0x272222),
      lighterMetalMaterial: Materials.metalWithColor(reflectionCube, 0x333333),
      
      // Satin materials
      satinMetalMaterial: Materials.withColor(reflectionCube, 0xBFC1C2),
      brownMaterial: Materials.withColor(reflectionCube, 0x272222),
      whiteMaterial: Materials.withColor(reflectionCube, 0xF5EEEE),
      pureWhiteMaterial: Materials.withColor(reflectionCube, 0xffffff),

      // Finish/Body Materials
      batteryMaterial: Materials.withoutColor(reflectionCube),
      standardMaterial: Materials.withoutColor(reflectionCube),
      transparentMaterial: Materials.withoutColor(reflectionCube),
      outerPremiumMaterial: Materials.metalWithoutColor(reflectionCube),
      innerPremiumMaterial: Materials.withoutColor(reflectionCube),
      artSeriesMaterial: Materials.withoutColor(reflectionCube),
      neckMaterial: Materials.withoutColor(reflectionCube),
      pickupMaterial: Materials.withoutColor(reflectionCube),
      headStockMaterial: Materials.withoutColor(reflectionCube),
      fretboardMaterial: Materials.withoutColor(reflectionCube),
      sidedotMaterial: Materials.withoutColor(reflectionCube),
      inlayMaterial: Materials.withoutColor(reflectionCube),
      hardwareMaterial: Materials.withColor(reflectionCube, 0xffffff),
    };
  }

  getRendererElement() {
    return this.renderer.domElement;
  }

  async createScene() {
    this.scene = new Three.Scene();
    this.camera = new Three.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 200);
    this.camera.position.z = -100;

    // Setup controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1;
    this.controls.maxDistance = 80;
    this.controls.minDistance = 20;
    this.controls.panSpeed = 0;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    
    const AMBIENT_INTENSITY = 1.0;
    const LIGHT_INTENSITY = 0.28;

    const ambient = new Three.AmbientLight( 0xffffff, AMBIENT_INTENSITY );
    this.scene.add(ambient);

    const lightModifier = 200;
    const positions = [
      // [1, 1, 1, LIGHT_INTENSITY],
      [1, 1, -1, LIGHT_INTENSITY],
      // [1, -1, 1, LIGHT_INTENSITY],
      [1, -1, -1, LIGHT_INTENSITY],
      // [-1, 1, 1, LIGHT_INTENSITY],
      [-0.5, 1.5, -1, LIGHT_INTENSITY],
      // [-1, -1, 1, LIGHT_INTENSITY],
      [-1, -1, -1, LIGHT_INTENSITY],
    ];
    
    _.each(positions, data => {
      const light = new Three.PointLight(0xffffff, data[3]);
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
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    if (this.models.current) {
      if (this.container.clientWidth < 1250) {
        const newScale = this.container.clientWidth / 1250.0;
        this.models.current.scale.x = newScale;
        this.models.current.scale.y = newScale;
        this.models.current.scale.z = newScale;
      } else {
        this.models.current.scale.x = 1.0;
        this.models.current.scale.y = 1.0;
        this.models.current.scale.z = 1.0;
      }
    }
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

  prepareModel() {
    if (!this.models.current) {
      throw new Error('Must have a model to perform updates');
    }

    const model = this.models.current;

    model.traverse( child => {
      if ( child instanceof Three.Mesh ) {
        console.log(child.name);
        switch (child.name) {
          case Groups.Tuners:
          case Groups.Bridge:
          case Groups.Round_Knob_on_body:
          case Groups.Tuner_Gold_Gear:
          case Groups.Tuner_Screws:
          // case Groups: Metal ring on tuner?
            child.material = this.materials.hardwareMaterial;
            break;
          case Groups.Strings:
          case Groups.Frets:          
          case Groups.Screws:
          case Groups.BatteryScrews:
            child.material = this.materials.satinMetalMaterial;
            break;
          case Groups.Pickups:
            child.material = this.materials.pickupMaterial;
            break;
          case Groups.Strap_holders:
            child.material = this.materials.blackMetalMaterial;
            break;
          case Groups.Fret_Dots_Small_side:
            child.material = this.materials.sidedotMaterial;
            break;
          case Groups.Fret_dots_Big_side:
            child.material = this.materials.inlayMaterial;
            break;
          case Groups.Logo:
          case 'Tuner_White_rubber':
            child.material = this.materials.whiteMaterial;
            break;
          case Groups.String_Ends:
            child.material = this.materials.metalMaterial;
            break;
          case Groups.String_Holder:
            child.material = this.materials.metalMaterial;
            break;
          case Groups.Body:
            if (this.finishMode === TRANSPARENT) {
              child.material = this.materials.transparentMaterial;
            }

            if (this.finishMode === STANDARD) {
              child.material = this.materials.standardMaterial;
            }

            if (this.finishMode === PREMIUM) {
              child.material = this.materials.outerPremiumMaterial;
            }

            if (this.finishMode === ARTSERIES) {
              child.material = this.materials.outerPremiumMaterial;
            }
            break;
          case Groups.BodyTop:
            if (this.finishMode === TRANSPARENT) {
              child.material = this.materials.transparentMaterial;
            }
  
            if (this.finishMode === STANDARD) {
              child.material = this.materials.standardMaterial;
            }

            if (this.finishMode === PREMIUM) {
              child.material = this.materials.innerPremiumMaterial;
            }

            if (this.finishMode === ARTSERIES) {
              child.material = this.materials.artSeriesMaterial;
            }
            break;
          case Groups.HeadTop:
            //TODO: CHange this
            child.material = this.materials.headStockMaterial;
            break;
          case Groups.Neck:
            child.material = this.materials.neckMaterial;
            break;
          case Groups.Fretboard:
            child.material = this.materials.fretboardMaterial;
            break;
          case Groups.Cable_Input:
            child.material = this.materials.lighterMetalMaterial;
            break;
          case Groups.BatteryCover:
            if (this.finishMode === ARTSERIES) {
              child.material = this.materials.artSeriesMaterial;
            } else {
              child.material = this.materials.lighterMetalMaterial;
            }

            break;
          case Groups.Battery_Button_Nub:
          default:
            child.material = this.materials.blackMetalMaterial;
            break;
        }
      }
    });
  }

  async updateSelections(type, key, option) {
    switch(type) {
      case 'material':
        console.log('material at:', key);
        await this.selectMaterial(option, key);
        break;
      case 'texture':
        console.log('texture at:', key);
        await this.selectTexture(option, key);
        break;
      case 'finish':
        console.log('finish at:', key);
        await this.selectFinish(option, key);
        break;
      default:
        console.log('This is something else entirely');
        break;
    }

    this.prepareModel();
  }

  // Configurator utilities for selections
  async selectModel(selection) {
    const model = _.find(this.assets.models, m => m.id === selection.asset);

    await new Promise((resolve, reject) => {
      try {
        this.modelLoader.load(model.location, obj => {
          obj.rotation.y = Math.PI;
          this.models.current = obj;

          if (this.container.clientWidth < 1250) {
            const newScale = this.container.clientWidth / 1250.0;
            this.models.current.scale.x = newScale;
            this.models.current.scale.y = newScale;
            this.models.current.scale.z = newScale;
          } else {
            this.models.current.scale.x = 1.0;
            this.models.current.scale.y = 1.0;
            this.models.current.scale.z = 1.0;
          }
          
          this.scene.add(obj);
          this.prepareModel();
          resolve('Success');
        }, (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(progress, percent);
          this.updatePercent(percent, true, false);
        });

        // (progress) => this.updatePercent((progress.loaded / progress.total * 100)), true, false
      } catch (ex) {
        reject(ex);
      }
    })
  }

  async selectMaterial(selection, key) {
    // TODO: Handle updating material
    console.log(selection);

    const color = colorToSigned24Bit(selection.color);

    switch(key) {
      case 'hardware':
        this.materials.hardwareMaterial = Materials.metalWithColor(this.reflectionCube, color);
        break;
      case 'sidedots':
        this.materials.sidedotMaterial = Materials.withColor(this.reflectionCube, color);
        break;
      case 'pickup-covers':
        this.materials.pickupMaterial = Materials.withColor(this.reflectionCube, color);
        break;
      default:
        console.log('Cannot determine what material to modify...');
        break;
    }
  }

  async selectTexture(selection, key) {
    console.log(selection);
    const asset = _.find(this.assets.textures, t => t.id === selection.asset);
    let texture;

    if (!this.textures[asset.filename]) {
      texture = Materials.loadTexture(asset.location, this.textureLoader, this.renderer);
      this.textures[asset.filename] = texture;
    } else {
      texture = this.textures[asset.filename];
    }
    
    console.log(key);

    // TODO: Handle updating material with texture
    switch(key) {
      case 'body-wood':
        this.materials.standardMaterial = Materials.withoutColor(this.reflectionCube);
        this.materials.standardMaterial.map = texture;

        if (selection.transparentAsset) {
          const transparentAsset = _.find(this.assets.textures, t => t.id === selection.transparentAsset);
          const transparentTexture = Materials.loadTexture(transparentAsset.location, this.textureLoader, this.renderer);
  
          this.materials.transparentMaterial = Materials.withoutColor(this.reflectionCube);
          this.materials.transparentMaterial.map = transparentTexture;
        }
        break;
      case 'neck':
        this.materials.neckMaterial = Materials.withoutColor(this.reflectionCube);
        this.materials.neckMaterial.map = texture;
        this.materials.headStockMaterial = this.materials.neckMaterial;
        break;
      case 'fingerboard':
        this.materials.fretboardMaterial = Materials.withoutColor(this.reflectionCube);
        this.materials.fretboardMaterial.map = texture;

        if (selection.name.toLowerCase().indexOf('richlite') !== -1) {
          this.materials.inlayMaterial = Materials.withColor(this.reflectionCube, 0xffffff);
        } else {
          this.materials.inlayMaterial = Materials.withColor(this.reflectionCube, 0x000000);
        }
        break;
      default:
        console.log('Cannot determine what texture to modify...');
        break;
    }
  }

  async selectFinish(selection, key) {
    console.log('Configuring new Finish');

    const { type } = selection;

    const color = colorToSigned24Bit(selection.color);

    // Default battery cover
    this.materials.batteryMaterial = this.materials.darkMetalMaterial;

    switch(type) {
      case 'standard':
        if (selection.name.toLowerCase().indexOf('transparent') !== -1) {
          this.finishMode = TRANSPARENT;
        } else {
          this.finishMode = STANDARD;
        }

        const map = this.materials.standardMaterial.map;
        this.materials.standardMaterial = Materials.withColor(this.reflectionCube, color);
        this.materials.standardMaterial.map = map;

        this.materials.headStockMaterial = this.materials.neckMaterial;
        break;
      case 'premium':
        this.finishMode = PREMIUM;

        this.materials.outerPremiumMaterial = Materials.metalWithColor(this.reflectionCube, color);
        this.materials.innerPremiumMaterial = Materials.withColor(this.reflectionCube, color);
        this.materials.headStockMaterial = this.materials.neckMaterial;
        break;
      case 'artseries':
        this.finishMode = ARTSERIES;

        this.materials.outerPremiumMaterial = Materials.artSeries(this.reflectionCube, color);
        this.materials.artSeriesMaterial = Materials.withoutColor(this.reflectionCube);

        const asset = _.find(this.assets.textures, t => t.id === selection.asset);
        this.materials.artSeriesMaterial.map = Materials.loadTexture(asset.location, this.textureLoader, this.renderer);

        const newLight = selection.name.toLowerCase().indexOf('light') !== -1;

        if (newLight) {
          this.materials.headStockMaterial = Materials.withColor(this.reflectionCube, 0xffffff);
        } else {
          this.materials.headStockMaterial = Materials.withColor(this.reflectionCube, 0x000000);
        }

        this.materials.batteryMaterial = this.materials.artSeriesMaterial;
        break;
    }
  }
}
