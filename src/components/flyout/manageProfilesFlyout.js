// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import {Modal} from "react-bootstrap";
import { connect } from 'react-redux';
import ProfileEditor from "../profileEditor/profileEditor";
import EditPencil from '../../assets/icons/EditPencil.svg';
import Trash from '../../assets/icons/Trash.svg';
import Add from '../../assets/icons/Add.svg';
import lang from '../../common/lang';

import './manageProfilesFlyout.css';

import { deleteProfile, getDeviceProfiles } from '../../actions/manageProfilesFlyoutActions';

class ManageProfilesFlyout extends React.Component {
  constructor() {
    super();
    this.state = {
      targetProfile: null
    };
  }

  componentWillMount() {
    this.props.getProperties();
  }

  showEditor = (profile) => {
    this.setState({
      targetProfile: profile,
      showEditor: true
    })
  }

  showDeleteConfirmation = (profile) => {
    this.setState({
      targetProfile: profile,
      showDeleteConfirmation: true
    })
  }

  deleteProfile = (profile) => {
    this.props.deleteProfile(profile);
    this.setState({
      showDeleteConfirmation: false
    });
  }

  render() {
    return (
      <div className="manage-profile-container">
        <div onClick={this.onClick} className="create-profile">
          <img src={Add} alt={`${Add}`} className="add-icon" />
          {lang.CREATEPROFILE}
        </div>
        <b/>
        Profiles:
        <div>
          {this.props.profiles.map((profile, idx) => {
            if (profile.Id === 0) {
              return null;
            }
            return (
              <div key={profile.Id}>
                <div className="groupname-icons">
                  {profile.DisplayName}
                  <span className="edit-delete-icons">
                    <span onClick={() => this.showEditor(profile)}>
                      <img src={EditPencil} alt={`${EditPencil}`} className="edit-icon" />
                    </span>
                    <span  onClick={() => this.showDeleteConfirmation(profile)} className="edit-delete-icons">
                      <img src={Trash} alt={`${Trash}`} className="delete-icon" />
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flyout-footer">
          <div onClick={this.props.onClose}>Cancel</div>
        </div>

        <Modal show={this.state.showEditor} bsSize='large'>
          <Modal.Body>
            <ProfileEditor onClose={() => this.setState({showEditor: false})} profile={this.state.targetProfile} />
          </Modal.Body>
        </Modal>

        <Modal show={this.state.showDeleteConfirmation} bsSize='large'>
          <Modal.Body>
            <p>Delete profile {(this.state.targetProfile || {}).DisplayName}?</p>
            <span className="dialog-buttons">
              <button className="btn btn-default profileEditorButton" onClick={() => this.setState({showDeleteConfirmation: false})}>Cancel</button>
              <button className="btn btn-default profileEditorButton" onClick={() => this.deleteProfile(this.state.targetProfile)}>Delete</button>
            </span>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getProperties: () => {
     dispatch(getDeviceProfiles());
  },
  deleteProfile: (profile) => {
     dispatch(deleteProfile(profile));
  }
});

const mapStateToProps = state => ({
  profileFilters: state.profileReducer.profileFilters,
  profiles: state.profileReducer.profiles
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageProfilesFlyout);
