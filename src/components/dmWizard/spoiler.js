// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import lang from "../../common/lang";

import './spoiler.css';


class Spoiler extends React.Component {
  constructor(props) {
    super(props);
    const { name, content } = props;
    this.state = {
      name,
      content,
      opened: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const { name, content } = nextProps;
    this.setState({
      name,
      content,
    });
  }

  toggleSpoiler = target =>
    this.setState({
      opened: !this.state.opened
    });

  render() {
    return (
      <div className="spoiler">
        <a title={this.state.name} onClick={() => this.toggleSpoiler()}>{this.state.name}</a>
        <div className="spoiler-content">
          {this.state.opened && this.props.children}
        </div>
      </div>
    );
  }
}

export default Spoiler;
