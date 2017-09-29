// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { connect } from 'react-redux';
import lang from "../../common/lang";
import Schema from '../../schema';
import { saveOrUpdateProfile } from '../../actions/profileEditorActions';
import JsonEditor from '@dr-kobros/react-jsoneditor';

import './profileEditor.css';


class ProfileEditor extends React.Component {

    constructor(props) {
        super(props);
        if (props.profile) {
            this.state = {
                Id: props.profile.Id,
                ETag: props.profile.ETag,
                DisplayName: props.profile.DisplayName,
                DesiredProperties: props.profile.DesiredProperties
            };
        } else {
            this.state = {
                DisplayName: '',
                DesiredProperties: {}
            }
        }
        this.subscriptions = [];
    }

    setProperties = properties => {
        this.setState({DesiredProperties: properties, message: Schema.validateDesiredProperties(this.state.properties)});
    }

    onProfileNameChange = event => {
        this.setState({ DisplayName: event.target.value });
    }

    save = () => {
        if (Schema.validateDesiredProperties(this.state.DesiredProperties) !== null) {
            return;
        }
        const profile = {
            Id: this.state.Id,
            ETag: this.state.ETag,
            DisplayName: this.state.DisplayName,
            DesiredProperties: this.state.DesiredProperties,
        }
        this.props.saveOrUpdateProfile(profile);
        this.props.onClose();
    }

    render() {
        return (
            <div className="profileEditorTile">
                <div className= "profileEditorLabel">
                    <label>Group Name</label>
                    <input className="form-control" style={{ width: "500px" }} value={this.state.DisplayName} placeholder={lang.PROFILE_NAME_PLACEHOLDER} onChange={this.onProfileNameChange} />
                </div>
                <div className="profileEditorTable">
                    <JsonEditor value={this.state.DesiredProperties} options={{mode: "tree"}} width='100%' height='100%' onChange={this.setProperties} />
                </div>
                <div className="profileEditorControls">
                    <pre className="profileEditorWarning">{this.state.message}</pre>
                    <button className="btn btn-default profileEditorButton" onClick={this.save}>Save</button>
                    <button className="btn btn-default profileEditorButton" style={{ marginRight:"10px" }} onClick={this.props.onClose}>Cancel</button>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    saveOrUpdateProfile: (profile) => {
        dispatch(saveOrUpdateProfile(profile));
    }
});

export default connect(null, mapDispatchToProps)(ProfileEditor)
