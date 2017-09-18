// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import Config from '../../common/config';
import lang from "../../common/lang";
import EventTopic, { Topics } from '../../common/eventtopic';
import Http from '../../common/httpClient';
import Schema from '../../schema';
import JsonEditor from '@dr-kobros/react-jsoneditor';

import './profileEditor.css';


class ProfileEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            profileName: '',
            properties: {
                desired: {
                    windows: {
                        rebootInfo: {
                            singleRebootTime: "2017-09-18T16:00:00-08:00"
                        }
                    }
                }
            }
        };

        this.subscriptions = [];
    }

    setProperties = properties => {
        this.setState({properties: properties, message: Schema.validateDesiredProperties(this.state.properties)});
    }

    componentWillUnmount = () => {
        EventTopic.unsubscribe(this.subscriptions);
    }

    onProfileNameChange = event => {
        this.setState({ profileName: event.target.value });
    }

    save = () => {
        if (Schema.validateDesiredProperties(this.state.properties) !== null) {
            return;
        }
        Http.post(Config.uiConfigApiUrl + '/api/v1/profilegroups/' + this.state.profileName, this.state.properties)
            .then((data) => {
                this.props.onClose();
                EventTopic.publish(Topics.profile.changed, null, this);
            }).catch((err) => {
                console.error(err);
                this.setState({ message: 'Failed to save profile: ' + err.message });
            });
    }

    render() {
        return (
            <div className="profileEditorTile">
                <div className= "profileEditorLabel">
                    <label>Group Name</label>
                    <input className="form-control" style={{ width: "500px" }} value={this.state.profileName} placeholder={lang.PROFILE.NAME_PLACEHOLDER} onChange={this.onProfileNameChange} />
                </div>
                <div className="profileEditorTable">
                    <JsonEditor value={this.state.properties} options={{mode: "tree"}} onChange={this.setProperties} />
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

export default ProfileEditor
