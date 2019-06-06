import React from 'react';
import _ from 'lodash';
import { Line } from 'rc-progress';
import { toast } from 'react-toastify';
import Axios from 'axios';

// Constants
import Modes from '../constants/modes';
import ModelMap from '../constants/model-map';

// WebGL Renderer
import Renderer from './Renderer';

// Views
import HomeView from './views/HomeView';
import OptionView from './views/OptionView';
import CustomerView from './views/CustomerView';
import PaymentView from './views/PaymentView';
import ConfirmationView from './views/ConfirmationView';
import ConfigurationService from '../services/ConfigurationService';
import AssetService from '../services/AssetService';
import { ClipLoader } from 'react-spinners';
import textureMap from '../constants/texture-map';

export default class Configurator extends React.Component {
  constructor(props) {
    super(props);

    // Initial State
    this.state = {
      loading: true,
      parsing: false,
      percent: 0,
      mode: Modes.HOME,
      price: 0,
      items: [],
      selections: {},
      uuids: [],
    };

    // Event bindings
    this.getItems = this.getItems.bind(this);
    this.propogateEvent = this.propogateEvent.bind(this);
    this.evaluatePrice = this.evaluatePrice.bind(this);
    this.configureSelection = this.configureSelection.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.handlePrice = this.handlePrice.bind(this);
    this.handleOrder = this.handleOrder.bind(this);
    this.handleMain = this.handleMain.bind(this);
    this.handlePayment = this.handlePayment.bind(this);
    this.submitOrder = this.submitOrder.bind(this);
    this.updatePercent = this.updatePercent.bind(this);
    this.transformItems = this.transformItems.bind(this);
    this.setUuids = this.setUuids.bind(this);

    // Name discrepancy is purposeful and legacy
    this.makeSelection = this.configureSelection.bind(this);

    // Setup components to use for different views
    this.components = {
      [Modes.HOME]: HomeView,
      [Modes.OPTION]: OptionView,
      [Modes.PAYMENT]: PaymentView,
      [Modes.CONFIRMATION]: ConfirmationView,
      [Modes.CUSTOMER]: CustomerView,
    };

    this.renderer = new Renderer(this.updatePercent);
  }

  setUuids(id) {
    this.setState({
      uuids: [id],
    });
  }

  transformItems(items) {
    _.each(items, item => {
      item.options = _.sortBy(item.options, ['id', 'price']);
    });

    const nonFinishItems = _.filter(items, i => i.key !== 'finish');
    const finishItems = _.sortBy(_.filter(items, i => i.key === 'finish'), i => Number.parseInt(i.position));

    const item = finishItems[0];
    item.title = 'Finish'
    item.options.push(...finishItems[1].options);
    item.options.push(...finishItems[2].options);

    const transformedItems = [...nonFinishItems, item];

    return _.sortBy(transformedItems, (i) => {
      return Number.parseInt(i.position);
    });
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

    // TODO: Fix this
    // Begin pricing module
    const selections = Configurator.getInitialData();
    const price = this.evaluatePrice(selections);

    this.setState({
      items: this.transformItems(items),
      models,
      textures,
      selections,
      price
    });

    const type = this.props.match.params.type;

    if (!type) {
      toast.error('Unable to load proper config, please check the URL you were given');
    }

    const model = ModelMap[type];
    this.renderer.finishMode = 'transparent';
    await this.renderer.selectModel({ asset: model }, 'body');
    await this.renderer.selectTexture({ asset: textureMap.maple, matte: true }, 'neck');
    await this.renderer.selectTexture({ asset: textureMap.alderTransparent, transparentAsset: textureMap.alder, matte: true }, 'body-wood');
    await this.renderer.selectTexture({ asset: textureMap.richlite, name:'richlite', matte: true }, 'fingerboard');
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

  updatePercent(percent, loading, parsing) {
    if (percent >= 100) {
      loading = false;
    }

    loading = loading === undefined ? true : loading;

    this.setState({
      percent,
      loading: loading,
    });
  }

  static getInitialData() {
    return {
      body: {type: 'model', asset: "c95aa5d830344811b8e726740199dda0", id: "6d65d532ad564be39484f29eb8526521", name: "Eight String", price: "2399"},
      ['body-wood']: {type: 'texture', asset: "5b06ca27a3fa40648e4261ba722521c5", color: "#000", id: "923e7yrq98w7dyf", location: "textures/roasted-eastern-hard-rock-flamed-maple.png", name: "Alder", price: "0"},
      neck: {asset: "812bdd08e0a0433a9eec59a835736bee", color: "#000", id: "b15f39a18970471e9b632e2b0085db13", name: "Eastern Hard Rock Maple", price: "0"},
      fingerboard: {asset: "4405833b559f462381727a1b538182ed", color: "#000", id: "fe58aedfd9104bfd878f11c785e08a61", name: "Richlite", price: "0"},
      sidedots: {color: "#000", id: "4261991f913648ab9cdee1a50e55a0a3", name: "Standard", price: "0"},
      hardware: {color: "#000", id: "c53266c4916242128c2f6889f28cf5b6", name: "Chrome", price: "0"},
      battery: {color: "#000", id: "6370194e256a4ae28264bcd0063abf6a", name: "Default 9V battery", price: "0"},
      pickups: {color: "#000", id: "aef2b3e099d64a23a813d01be244c855", name: "White", price: "0"},
      finish: {color: "#fcfcfc", id: "af47f49cfc0e4a6e9f7954d3e1d54948", name: "Natural Transparent", price: "0"},
    };
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
    const price = this.evaluatePrice(selections);

    this.setState({
      selections,
      price,
    });
  }

  evaluatePrice(selections) {
    return Number.parseInt(_.map(selections, s => s.price).reduce((p, c) => {
      p = Number.parseInt(p);
      c = Number.parseInt(c);

      return p + c;
    }, 0));
  }

  getItems() {
    return this.state.items;
  }

  // Modal utilities
  changeMode(mode) {
    this.setState({
      mode,
    });
  }

  handlePrice() {
    this.changeMode(Modes.CONFIRMATION);
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

  async submitOrder(token) {
    const { order } = this.state;

    const response = await Axios('https://us-central1-abasi-configurator.cloudfunctions.net/submitOrder', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      data: {
        order,
        token: token.id,
      }
    });

    if (response.ok) {
      toast.success('Successfully submitted order. You receipt has been emailed to you');
    } else {
      toast.error('Unable to process order at this time');
      console.log(response);
    }
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
          />
        }
      </div>
    );
  }
}
