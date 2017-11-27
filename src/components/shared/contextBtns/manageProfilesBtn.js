// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../../actions/actionTypes';
import lang from '../../../common/lang';
import PcsBtn from '../../shared/pcsBtn/pcsBtn';
import ManageProfilesSvg from '../../../assets/icons/ManageProfiles.svg';

class ManageProfilesBtn extends Component {
  render() {
    return (
      <PcsBtn
        svg={ManageProfilesSvg}
        onClick={this.props.openManageProfilesFlyout.bind(this, this.props.profiles)}
        value={lang.MANAGE_PROFILES} />
    );
  }
}

// Connect to Redux store
const mapDispatchToProps = dispatch => {
  return {
    openManageProfilesFlyout: profiles =>
      dispatch({
        type: actionTypes.FLYOUT_SHOW,
        content: { type: 'Manage Profiles', profiles }
      })
  };
};

const mapStateToProps = state => ({
  profiles: state.profileReducer.profiles
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageProfilesBtn);
