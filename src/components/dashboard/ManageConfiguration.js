import React from 'react';
import ConfigurationService from '../../services/ConfigurationService';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

class ManageConfiguration extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      config: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.getLineitem = this.getLineitem.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.save = this.save.bind(this);
    this.sort = this.sort.bind(this);
    this.deleteConfig = this.deleteConfig.bind(this);
  }

  componentDidMount() {
    this.getConfiguration();
  }

  async getConfiguration() {
    const config = await ConfigurationService.getAll();
    this.sort(config);
  }

  async deleteConfig(id) {
    console.log(id);
    await ConfigurationService.delete(id);
    await this.getConfiguration();
    toast.success('Removed configuration item');
  }

  sort(config) {
    config = _.sortBy(config, (c) => Number.parseInt(c.position));

    this.setState({
      config,
    })
  }

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  }

  async save() {
    this.setState({
      saving: true,
    });

    await ConfigurationService.saveAll(this.state.config);
    toast.success('Successfully saved configuration');
    this.setState({
      saving: false,
    });
  }

  moveUp(id) {
    const { config } = this.state;

    if (config) {
      const c = _.find(config, c => c.id === id);
      c.position = Number.parseInt(c.position);
      c.position--;

      this.sort(config);
    } else {
      console.log('Something horrible is happening');
    }
  }

  moveDown(id) {
    const { config } = this.state;

    if (config) {
      const c = _.find(config, c => c.id === id);
      c.position = Number.parseInt(c.position);
      c.position++;

      this.sort(config);
    } else {
      console.log('Something horrible is happening');
    }
  }

  getLineitem(config) {
    const options = config.options ? config.options.length : 0;
    const configUrl = `/edit-config/${config.id}`;

    return (
      <tr className="abasi-config-item" key={config.id}>
        <td className="position">{ config.position }.</td>
        <td className="title">{ config.title }</td>
        <td className="type">{ config.type}</td>
        <td className="key">{ config.key}</td>
        <td className="options">{ options } Subitems</td>
        <td className="shuffle">
          <button className="move up" onClick={() => this.moveUp(config.id)}>
            <i className="fa fa-arrow-up"></i>
          </button>

          <button className="move down" onClick={() => this.moveDown(config.id)}>
            <i className="fa fa-arrow-down"></i>
          </button>
        </td>
        <td>
          <Link to={configUrl}>
            Edit
          </Link>
        </td>
        <td>
          <button onClick={() => this.deleteConfig(config.id)} className="abasi-delete-config">
            Delete
          </button>
        </td>
      </tr>
    );
  }
  
  getConfigContent(config) {
    const lineitems = _.map(config, this.getLineitem);

    return (
      <table className="abasi-config-items abasi-table" border="1" frame="void" rules="rows">
        <thead className="abasi-config-item">
          <tr>
            <th className="position">#</th>
            <th className="title">Title</th>
            <th className="type">Type</th>
            <th className="key">Key</th>
            <th className="options">Options</th>
            <th className="shuffle">Move</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          { lineitems }
        </tbody>
      </table>
    );
  }

  render() {
    const { config, saving } = this.state;
    let content;

    if (config && config.length) {
      content = this.getConfigContent(config);
    } else {
      content = (
        <span className="flex columns loading">
          <ClipLoader />
          <p>Loading Configuration</p>
        </span>
      );
    }

    return (
      <div className="flex columns abasi-config">
        <h1>Configuration Management</h1>

        <button disabled={saving} className="abasi-save-config" onClick={this.save}>
          { saving && 
            <ClipLoader />
          }

          { !saving && 
            <span>Save Configuration</span>
          }
        </button>

        <Link to="/add-config">
          <button className="add-config">
            Add Configuration Item
          </button>
        </Link>

        <div className="flex columns abasi-config-wrapper">
          { content }
        </div>
      </div>
    );
  }
}

export default ManageConfiguration;
