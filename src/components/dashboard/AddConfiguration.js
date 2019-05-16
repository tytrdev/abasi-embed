import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import ConfigurationService from '../../services/ConfigurationService';
import AssetService from '../../services/AssetService';
import LineItem from './LineItem';

class AddConfiguration extends React.Component {
  constructor(props) {
    super(props);

    const id = this.props.match ? this.props.match.params.id : undefined;

    this.state = {
      editing: id || false,
      loading: id || false,
      config: {
        id: undefined,
        title: undefined,
        description: undefined,
        type: 'texture',
        position: 99,
        key: undefined,
        options: [],
      },
      metadata: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.getConfiguration = this.getConfiguration.bind(this);
    this.addLineItem = this.addLineItem.bind(this);
    this.removeLineItem = this.removeLineItem.bind(this);
    this.updateLineItem = this.updateLineItem.bind(this);
  }

  componentDidMount() {
    if (this.props.match && this.props.match.params.id) {
      this.getConfiguration(this.props.match.params.id);
    }
  }

  async getConfiguration(id) {
    const config = await ConfigurationService.get(id);

    let metadata;

    switch (config.type) {
      case 'model':
        metadata = await AssetService.getModelMetadata();
        break;
      case 'texture':
        metadata = await AssetService.getTextureMetadata();
        break;
      default:
        break;
    }

    this.setState({
      config,
      metadata,
      loading: false,
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { config } = this.state;
    config[name] = value;

    this.setState({
      config,
    });
  }

  async save(event) {
    event.preventDefault();

    const { title, description, key } = this.state.config;

    if (!title || !description || !key) {
      return toast.error('Must provide title, description, and key');
    }

    await ConfigurationService.create(this.state.config);
    toast.success('Successfully saved configuration item!');

    this.props.history.push('/config');
  }

  addLineItem() {
    const { config } = this.state;
    ConfigurationService.createLineitem(config, {});
    
    this.setState({
      config,
    });
  }

  removeLineItem(item) {
    const { config } = this.state;
    config.options = _.filter(config.options, o => o.id !== item.id);

    this.setState({ 
      config,
    });
  }

  getLineItems(items) {
    // Magic for first configuration item
    if (items && items.length) {
      items = [{
        maskFields: true,
      }, ...items];
    } else {
      items = [{
        maskFields: true,
      }];
    }

    return _.map(items, item => (
      <LineItem 
        data={item}
        key={`lineitem-${item.id}`}
        delete={this.removeLineItem}
        metadata={this.state.metadata}
        callback={this.updateLineItem}
        type={this.state.config.type}
      />
    ));
  }
  
  updateLineItem(item) {
    console.log(item);
    const { config } = this.state;
    config.options = _.filter(config.options, o => o.id !== item.id).concat([item]);
  }

  render() {
    const { loading, editing, config } = this.state;

    if (loading) {
      return (
        <div className="abasi-add flex columns">
          <ClipLoader />
          Loading Configuration...
        </div>
      )
    }

    const lineitems = this.getLineItems(config.options);

    return (
      <div className="abasi-add flex columns">
        { editing &&
          <h1>Edit Configuration Item</h1>
        }

        {!editing &&
          <h1>Add Configuration Item</h1>
        }

        <Link to="/config">
          <button className="btn back-button">
            Back to configuration
          </button>
        </Link>

        <form onSubmit={this.save} className="">
          <div className="flex columns">
            <label htmlFor="title">
              <span className="label">Title:</span>

              <input className="abasi-input"
                type="text"
                name="title"
                placeholder="Title"
                value={config.title} 
                onChange={this.handleChange}
              />
            </label>

            <label htmlFor="description">
              <span className="label">Description:</span>

              <input className="abasi-input"
                type="text"
                name="description"
                placeholder="Description"
                value={config.description} 
                onChange={this.handleChange}
              />
            </label>

            <label htmlFor="key">
              <span className="label">Key:</span>

              <input className="abasi-input"
                type="text"
                name="key"
                placeholder="Key"
                value={config.key} 
                onChange={this.handleChange}
              />
            </label>

            <label htmlFor="type">
              <span className="label">Configuration Type:</span>

              <select name="type" value={config.type} className="abasi-input" onChange={this.handleChange}>
                <option value="texture">Texture</option>
                <option value="model">Model</option>
                <option value="material">Material</option>
                <option value="submenu">Submenu</option>
                <option value="finish">Finish</option>
              </select>
            </label>

            <label htmlFor="position">
              <span className="label">Position:</span>

              <input className="abasi-input"
                type="number"
                name="position"
                value={config.position}
                onChange={this.handleChange}
              />
            </label>

            <div className="flex columns abasi-selections">
              <h1>Configuration Line Items</h1>

              <button className="btn abasi-add-line-item" type="button" onClick={this.addLineItem}>
                Add New Line Item
              </button>

              <div className="flex columns lineitems">
                { lineitems }
              </div>
            </div>

            <button type="submit" className="btn abasi-add-button">
              Save Configuration Item
            </button>
          </div>
        </form>
      </div>
    );
  }
}

AddConfiguration.propTypes = {
  match: PropTypes.object,
};

export default AddConfiguration;
