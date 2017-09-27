// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import { browserHistory } from "react-router";

import PcsBtn from "../../shared/pcsBtn/pcsBtn";
import lang from "../../../common/lang";

import '../cellRenderer.css'

class ExploreCellRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false
    }
  }

  toggleCell = () => {
    this.setState({ showPopup: !this.state.showPopup });
  }

  redirectToMaintenence = () => {
    browserHistory.push({ pathname: `/maintenance/`});
  }

  render() {
    const { value } = this.props;
    return (
      <div className="pcs-renderer-cell explore" onClick={this.toggleCell}>
        <div className="pcs-renderer-text">
          {value}
        </div>
        { this.state.showPopup && <PcsBtn className="primary" onClick={this.redirectToMaintenence}> {lang.GOTO_MAINTENANCE} </PcsBtn> }
      </div>
    );
  }
}

export default ExploreCellRenderer;
