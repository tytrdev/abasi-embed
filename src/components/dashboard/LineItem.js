import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FinishPicker from './FinishPicker';

class LineItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: null,
      metadata: this.props.metadata,
      ...this.props.data,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleColor = this.handleColor.bind(this);
    this.getMaskedContent = this.getMaskedContent.bind(this);
    this.getItemContent = this.getItemContent.bind(this);
    this.getFinishContent = this.getFinishContent.bind(this);
  }

  handleChange(event) {
    const { name } = event.target;
    let { value } = event.target;

    if (event.target.type === 'checkbox') {
      console.log('Checkbox!');

      value = event.target.checked;
    }
    
    const data = _.cloneDeep(this.state);
    delete data.metadata;
    data[name] = value;
    this.props.callback(data);

    this.setState({
      [name]: value,
    });
  }

  handleColor(color) {
    this.handleChange({
      target: {
        name: 'color',
        value: color.hex,
      }
    });
  }

  getMaskedContent() {
    const { type } = this.props;

    if (type === 'finish') {
      return (
        <div className="flex abasi-lineitem">
          <div className="name">
            Name
          </div>

          <div className="price">
            Price
          </div>

          <div className="color">
            Color
          </div>

          <div className="transparent">
            Transparent?
          </div>

          <div className="delete">
            Delete
          </div>
        </div>
      );
    }

    return (
      <div className="flex abasi-lineitem">
        <div className="name">
          Name
        </div>
        
        <div className="price">
          Price
        </div>

        <div className="asset">
          Asset
        </div>

        <div className="delete">
          Delete
        </div>
      </div>
    );
  }

  getFinishContent(data) {
    return (
      <div className="flex abasi-lineitem">
        <div className="name">
          <input className=""
            type="text"
            name="name"
            placeholder="Name"
            value={data.name} 
            onChange={this.handleChange}
          />
        </div>

        <div className="price">
          <input className=""
            type="number"
            name="price"
            value={data.price}
            onChange={this.handleChange}
          />
        </div>
        
        <div className="color">
          <FinishPicker 
            color={ this.state.color || '#000' }
            onChangeComplete={ this.handleColor }
          />
        </div>

        <div className="transparent">
          <input
            type="checkbox"
            name="transparent"
            checked={data.transparent}
            onChange={this.handleChange}
          />
        </div>

        <div className="delete">
          <button className="btn" type="button" onClick={() => { this.props.delete(data) }}>
            Delete
          </button>
        </div>
      </div>
    );
  }

  getItemContent(data) {
    const { type } = this.props;

    if (type === 'finish' || type === 'material') {
      return this.getFinishContent(data);
    }

    return (
      <div className="flex abasi-lineitem">
        <div className="name">
          <input className=""
            type="text"
            name="name"
            placeholder="Name"
            value={data.name} 
            onChange={this.handleChange}
          />
        </div>
        
        <div className="price">
          <input className=""
            type="number"
            name="price"
            value={data.price}
            onChange={this.handleChange}
          />
        </div>

        <div className="asset">
          <select name="asset" value={data.asset} className="" onChange={this.handleChange}>
            { _.map(data.metadata, m => <option value={m.id}>{m.filename}</option>)}
          </select>
        </div>

        <div className="delete">
          <button className="btn" type="button" onClick={() => { this.props.delete(data) }}>
            Delete
          </button>
        </div>
      </div>
    );
  }

  render() {
    const data = this.state;

    if (data.maskFields) {
      return this.getMaskedContent();
    }

    return this.getItemContent(data);
  }
}

LineItem.propTypes = {
  delete: PropTypes.func,
  callback: PropTypes.func,
  metadata: PropTypes.array.isRequired,
};

export default LineItem;
