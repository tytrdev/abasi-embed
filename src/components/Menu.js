import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uuids: [],
    };

    this.getOption = this.getOption.bind(this);
    this.getItem = this.getItem.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
  }

  handleSelection(event) {
    const item = event.target;

    console.log(item);
  }

  getOption(item, option, i) {
    return (
      <span key={`menu-item-option-${i}`} className="item-option" onClick={() => this.props.callback(item, option)}>
        <span className="item-option-name">
          { option.name }
        </span>

        <span className="item-option-price">
          ${ option.price }
        </span>
      </span>
    )
  }

  getItem(item, i) {
    const options = _.map(item.options, (option, i) => {
      return this.getOption(item, option, i);
    });

    return (
      <AccordionItem key={`menu-item-${i}`} onClick={() => this.handleSelection(item.id)} uuid={item.id}>
        <AccordionItemHeading>
          <AccordionItemButton>
            <span className="item-title">
              { item.title }
            </span>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <span className="item-description">
            { item.description }
          </span>

          <span className="item-options">
            { options }
          </span>
        </AccordionItemPanel>
      </AccordionItem>
    );
  }

  render() {
    const items = _.map(this.props.items, this.getItem);

    return (
      <Accordion allowZeroExpanded className="configurator-menu">
        { items }
      </Accordion>
    );
  }
}

Menu.defaultProps = {
  columns: false,
};

Menu.propTypes = {
  items: PropTypes.array.isRequired,
  callback: PropTypes.func.isRequired,
  columns: PropTypes.bool,
  renderer: PropTypes.object.isRequired,
};

export default Menu;
