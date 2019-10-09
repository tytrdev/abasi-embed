import React from 'react';
import _ from 'lodash';
import { Line } from 'rc-progress';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

// Constants
import Modes from '../constants/modes';

// WebGL Renderer
import Renderer from './Renderer';

// Views
import HomeView from './views/HomeView';

import ConfigurationService from '../services/ConfigurationService';
import AssetService from '../services/AssetService';
import textureMap from '../constants/texture-map';

/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
export default class Configurator extends React.Component {
  constructor(props) {
    super(props);

    // Initial State
    this.state = {
      loading: true,
      parsing: false,
      percent: 0,
      mode: Modes.HOME,
      items: [],
      selections: {},
      uuids: [],
    };

    // Event bindings
    this.getItems = this.getItems.bind(this);
    this.propogateEvent = this.propogateEvent.bind(this);
    this.configureSelection = this.configureSelection.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.handleOrder = this.handleOrder.bind(this);
    this.handleMain = this.handleMain.bind(this);
    this.updatePercent = this.updatePercent.bind(this);
    this.transformItems = this.transformItems.bind(this);
    this.setUuids = this.setUuids.bind(this);
    this.handleScreenshot = this.handleScreenshot.bind(this);

    // Name discrepancy is purposeful and legacy
    this.makeSelection = this.configureSelection.bind(this);

    // Setup components to use for different views
    this.components = {
      [Modes.HOME]: HomeView,
    };

    this.renderer = new Renderer(this.updatePercent);
  }

  async componentDidMount() {
    // Startup/attach renderer
    this.rendererContainer = document.getElementById('renderer-container');
    this.renderer.container = this.rendererContainer;

    // Initialize the scene if we haven't already done so
    if (!this.renderer.scene) {
      this.renderer.createScene();
    }

    this.rendererContainer.appendChild(this.renderer.getRendererElement());

    // Grab configuration items for the user menu
    const items = await ConfigurationService.getConfig();
    const models = await AssetService.getModelMetadata();
    const textures = await AssetService.getTextureMetadata();

    const selections = Configurator.getInitialData();

    this.setState({
      items: this.transformItems(items),
      models,
      textures,
      selections,
    });

    this.renderer.finishMode = 'transparent';
    await this.renderer.selectModel({ }, 'body');
    await this.renderer.selectTexture({ asset: textureMap.maple, matte: true }, 'neck');
    await this.renderer.selectTexture({ asset: textureMap.alderTransparent, transparentAsset: textureMap.alder, matte: true }, 'body-wood');
    await this.renderer.selectTexture({ asset: textureMap.richlite, name: 'richlite', matte: true }, 'fingerboard');
    await this.renderer.selectMaterial({ color: '#BFC1C2' }, 'hardware');
    await this.renderer.selectFinish({ name: 'transparent', color: '#ffffff' });
    await this.renderer.prepareModel();
  }

  componentDidUpdate() {
    // Update/re-attach renderer
    if (this.state.mode === Modes.HOME) {
      this.rendererContainer = document.getElementById('renderer-container');
      this.renderer.container = this.rendererContainer;
      this.rendererContainer.appendChild(this.renderer.getRendererElement());
      this.renderer.resize();
      this.renderer.assets = {
        models: this.state.models,
        textures: this.state.textures,
      };
    }
  }

  setUuids(id) {
    this.setState({
      uuids: [id],
    });
  }

  static getInitialData() {
    return {
      body: {
        type: 'model', asset: 'c95aa5d830344811b8e726740199dda0', id: '6d65d532ad564be39484f29eb8526521', name: 'Eight String', price: '2399',
      },
      'body-wood': {
        type: 'texture', asset: '5b06ca27a3fa40648e4261ba722521c5', id: '923e7yrq98w7dyf', location: 'textures/roasted-eastern-hard-rock-flamed-maple.png', name: 'Alder', price: '0',
      },
      neck: {
        asset: '812bdd08e0a0433a9eec59a835736bee', id: 'b25678b75dd245e29fdafd88b219c620', name: 'Eastern Hard Rock Maple', price: '0',
      },
      fingerboard: {
        asset: '4405833b559f462381727a1b538182ed', id: 'fe58aedfd9104bfd878f11c785e08a61', name: 'Richlite', price: '0',
      },
      sidedots: { id: '8f7b9e3d941441318fbedecd10844f23', name: 'Standard', price: '0' },
      hardware: { id: 'c53266c4916242128c2f6889f28cf5b6', name: 'Chrome', price: '0' },
      battery: { id: 'f645bb13b9a042ceaf17dbdc35e05bcd', name: 'Default 9V battery', price: '0' },
      'pickup-covers': { id: 'aef2b3e099d64a23a813d01be244c855', name: 'White', price: '0' },
      finish: { id: 'af47f49cfc0e4a6e9f7954d3e1d54948', name: 'Natural Transparent', price: '0' },
    };
  }

  getItems() {
    return this.state.items;
  }

  handleScreenshot() {
    const strMime = 'image/jpeg';
    const imgData = this.renderer.renderer.domElement.toDataURL(strMime);

    const saveFile = (strData, filename) => {
      const link = document.createElement('a');
      if (typeof link.download === 'string') {
        document.body.appendChild(link); // Firefox requires the link to be in the body
        link.download = filename;
        link.href = strData;
        link.click();
        document.body.removeChild(link); // remove the link when done
      } else {
        window.open(strData, '_blank');
      }
    };

    saveFile(imgData.replace(strMime, 'image/octet-stream'), 'abasi.jpg');
  }

  async configureSelection(selection, option) {
    const { selections } = this.state;
    const { key, type } = selection;

    try {
      await this.renderer.updateSelections(type, key, option);
    } catch (ex) {
      console.log(ex);
      toast.error('Hmm...having trouble loading that asset');
    }

    selections[key] = option;

    this.setState({
      selections,
    });
  }

  updatePercent(percent, loading) {
    if (percent >= 100) {
      loading = false;
    }

    loading = loading === undefined ? true : loading;

    this.setState({
      percent,
      loading,
    });
  }

  transformItems(items) {
    _.each(items, (item) => {
      item.options = _.sortBy(item.options, ['id', 'price']);
    });

    const nonFinishItems = _.filter(items, i => i.key !== 'finish');
    const finishItems = _.sortBy(_.filter(items, i => i.key === 'finish'), i => Number.parseInt(i.position, 10));

    const item = finishItems[0];
    item.title = 'Finish';
    item.options.push(...finishItems[1].options);
    item.options.push(...finishItems[2].options);

    const transformedItems = [...nonFinishItems, item];

    return _.sortBy(transformedItems, i => Number.parseInt(i.position, 10));
  }


  // Modal utilities
  changeMode(mode) {
    this.setState({
      mode,
    });
  }

  handleOrder() {
    this.changeMode(Modes.CUSTOMER);
  }

  handleMain() {
    this.changeMode(Modes.HOME);
  }

  propogateEvent(event) {
    // TODO: Event handler code for renderer events
    this.renderer.handleEvent(event, this.state.data);
  }

  handlePayment(purchaserInfo) {
    const data = {
      specs: this.state.selections,
      purchaserInfo,
      total: this.state.price,
    };

    this.setState({
      order: data,
    });

    this.changeMode(Modes.PAYMENT);
  }

  render() {
    // TODO: Pre-rendered components?
    const Component = this.components[this.state.mode];

    if (!Component) {
      throw new Error(`Component missing for mode ${this.state.mode}`);
    }

    return (
      <div className="configurator">
        { this.state.loading &&
          <div className="configurator-spinner">
            <ClipLoader />
            <p>Loading Abasi Guitars Custom Configurator</p>
            <Line percent={this.state.percent} strokeWidth="8" strokeColor="#000" />
          </div>
        }

        { this.state.parsing &&
          <div className="configurator-spinner">
            <Line percent={this.state.percent} strokeWidth="8" strokeColor="#000" />
            <p>Parsing Model</p>
          </div>
        }

        {this.getItems() &&
          <Component
            renderer={this.renderer}
            items={this.state.items}
            makeSelection={this.makeSelection}
            price={this.state.price}
            depositPrice={this.state.depositPrice}
            loading={this.state.loading}
            handlePrice={this.handlePrice}
            handleMain={this.handleMain}
            handlePayment={this.handlePayment}
            data={this.state.selections}
            handleOrder={this.handleOrder}
            updatePercent={this.updatePercent}
            uuids={this.state.uuids}
            setUuids={this.setUuids}
            selections={this.state.selections}
            submit={this.submitOrder}
            handleScreenshot={this.handleScreenshot}
          />
        }
      </div>
    );
  }
}
