import React from 'react';

export default class Viewport extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(data) {
    this.props.setData(data);
  }

  mountRenderer(element) {
    this.containerRef.appendChild(element);
  }

  render() {
    return (
      <div id="renderer-container" className="viewport-view" />
    );
  }
}
