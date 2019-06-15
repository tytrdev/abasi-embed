import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import uuid from 'uuid';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { toast } from 'react-toastify';

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.getOption = this.getOption.bind(this);
    this.getItem = this.getItem.bind(this);
    this.displayDescription = this.displayDescription.bind(this);
    this.getMiscItems = this.getMiscItems.bind(this);
    this.getMiscOption = this.getMiscOption.bind(this);

    this.state = {
      expiredDescriptions: [],
    }
  }

  displayDescription(item) {
    const expiredIds = this.state.expiredDescriptions;

    if (expiredIds.indexOf(item.id) === -1 && item.description && item.description !== '') {
      toast.info(item.description, {
        autoClose: false,
      });

      expiredIds.push(item.id);

      this.setState({
        expiredDescriptions: expiredIds,
      });
    }
  }

  getFinishOptions(item, i) {
    const standardFinishes = _.filter(item.options, o => o.type === 'standard').map(o => this.getOption(item, o, i));
    const premiumFinishes = _.filter(item.options, o => o.type === 'premium').map(o => this.getOption(item, o, i));
    const artSeriesFinishes = _.filter(item.options, o => o.type === 'artseries').map(o => this.getOption(item, o, i));

    return (
      <Accordion preExpanded={this.props.uuids} allowZeroExpanded className="configurator-finish-menu">
        <AccordionItem key="standard-finishes">
          <AccordionItemHeading>
            <AccordionItemButton>
              <span className="item-title">
                Standard Finishes
              </span>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <span className="item-options">
              { standardFinishes }
            </span>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem key="premium-finishes">
          <AccordionItemHeading>
            <AccordionItemButton>
              <span className="item-title">
                Premium Finishes
              </span>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <span className="item-options">
              { premiumFinishes }
            </span>
          </AccordionItemPanel>
        </AccordionItem>

        <AccordionItem key="artseries-finishes">
          <AccordionItemHeading>
            <AccordionItemButton>
              <span className="item-title">
                Art Series Finishes
              </span>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <span className="item-options">
              { artSeriesFinishes }
            </span>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    );
  }

  getOption(item, option, i) {
    const isActive = _.find(this.props.selections, s => s.id === option.id);
    const showPrice = Number.parseInt(option.price) > 0;

    const optionClass = `item-option ${ isActive ? 'active' : '' }`;

    // const key = this.props.mobile ? `mobile-menu-item-option-${item.id}-${i}` : `menu-item-option-${item.id}-${i}`;

    return (
      <span className={optionClass} onClick={() => this.props.callback(item, option)} key={uuid.v4()}>
        <span className="item-option-name">
          { option.name }
        </span>

        <span className="item-option-price">
          { showPrice &&
            <span>+ ${ option.price }</span>
          }
        </span>
      </span>
    )
  }

  getItem(item, i) {
    let options;

    if (item.key === 'finish') {
      options = this.getFinishOptions(item, i);
    } else {
      options = _.map(item.options, (option, i) => {
        return this.getOption(item, option, i);
      });
    }

    return (
      <AccordionItem onClick={() => this.props.setUuids(item.id)} uuid={item.id} key={item.id}>
        <AccordionItemHeading onClick={() => this.displayDescription(item)}>
          <AccordionItemButton>
            <span className="item-title">
              { item.title }
            </span>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <span className="item-options">
            { options }
          </span>
        </AccordionItemPanel>
      </AccordionItem>
    );
  }

  getMiscOption(item, option, i) {
    const misc = _.find(this.props.selections, (s, k) => k === 'misc');
    const isActive = _.find(misc, o => o.id === option.id);
    const showPrice = Number.parseInt(option.price) > 0;
    const optionClass = `item-option ${ isActive ? 'active' : '' }`;

    return (
      <span className={optionClass} onClick={() => this.props.miscCallback(option)} key={uuid.v4()}>
        <span className="item-option-name">
          { option.name }
        </span>

        <span className="item-option-price">
          { showPrice &&
            <span>+ ${ option.price }</span>
          }
        </span>
      </span>
    )
  }

  getMiscItems(miscItem) {
    const options = _.map(miscItem.options, (option, i) => {
      return this.getMiscOption(miscItem, option, i);
    });

    return (
      <AccordionItem onClick={() => this.props.setUuids(miscItem.id)} uuid={miscItem.id}>
        <AccordionItemHeading onClick={() => this.displayDescription(miscItem)}>
          <AccordionItemButton>
            <span className="item-title">
              { miscItem.title }
            </span>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <span className="item-options">
            { options}
          </span>
        </AccordionItemPanel>
      </AccordionItem>
    );
  }

  render() {
    const nonMiscItems = _.filter(this.props.items, i => i.key !== 'misc');
    const miscItem = _.find(this.props.items, i => i.key === 'misc');

    if (miscItem) {
      const items = _.map(nonMiscItems, this.getItem);
      const miscItems = this.getMiscItems(miscItem);
  
      return (
        <Accordion preExpanded={this.props.uuids} allowZeroExpanded className="configurator-menu">
          {/* Standard Items */}
          { items }
  
          {/* Misc items are handled differently */}
          { miscItems }
        </Accordion>
      );
    } else {
      return (
        ''
      );
    }
  }
}

Menu.defaultProps = {
  columns: false,
};

Menu.propTypes = {
  items: PropTypes.array.isRequired,
  callback: PropTypes.func.isRequired,
  miscCallback: PropTypes.func.isRequired,
  columns: PropTypes.bool,
  renderer: PropTypes.object.isRequired,
  selections: PropTypes.object.isRequired,
};

export default Menu;
