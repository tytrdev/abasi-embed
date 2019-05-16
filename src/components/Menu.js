import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Tile from './Tile';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';

// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/fancy-example.css';

const Menu = ({ items, callback }) => {
  const tiles = _.map(items, (item, i) => {
    // return (
    //   <Tile key={i} data={item} callback={callback} />
    // );

    console.log(item, i);

    const options = _.map(item.options, option => {
      console.log(option);

      return (
        <span className="item-option">
          <span className="item-option-name">
            { option.name }
          </span>

          <span className="item-option-price">
            ${ option.price }
          </span>
        </span>
      )
    });

    return (
      <AccordionItem>
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
    )
  });

  return (
    <Accordion>
      { tiles }
    </Accordion>
  );
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
