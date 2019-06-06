import React from 'react';
import { slide as Slide } from 'react-burger-menu';

import Menu from './Menu';
import Price from './Price';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle(e) {
    e.preventDefault();
    this.setState({
      open: !this.state.open,
    });
  }

  showSettings(event) {
    event.preventDefault();
  }

  render() {
    const visibility = this.props.loading ? 'hidden' : 'visible';

    const style = {
      visibility,
    };

    return (
      <Slide
        isOpen={this.state.open}
        pageWrapId={ 'app-body' }
        outerContainerId={ 'app-container' }
        
      >
        <Menu
          columns
          mobile
          items={this.props.items}
          renderer={this.props.renderer}
          callback={this.props.callback}
          uuids={this.props.uuids}
          setUuids={this.props.setUuids}
          selections={this.props.selections}
        />

        <button type="button" className="review-btn" onClick={this.props.handlePrice} style={style}>
          Review Order
        </button>

        <div className="price-btn" style={style}>  
          <Price price={this.props.price} handlePrice={this.props.handlePrice} />
        </div>
      </Slide>
    );
  }
}

export default Sidebar;
