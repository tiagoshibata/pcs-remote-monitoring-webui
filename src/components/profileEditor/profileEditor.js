// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import Config from '../../common/config';
import lang from "../../common/lang";
import EventTopic, { Topics } from '../../common/eventtopic';
import Http from '../../common/httpClient';

import './profileEditor.css';

class ProfileEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            profileName: '',
            properties: [
                { Key: '',  Value: '', Type: 'String' }
            ]
        };

        this.subscriptions = [];
    }

    componentWillUnmount() {
        EventTopic.unsubscribe(this.subscriptions);
    }

    onProfileNameChange = (event) => {
        this.setState({ groupName: event.target.value });
    }

    onNewClause = () => {
        this.state.properties.push({ Key: '', Value: '', Type: 'String'})
        this.setState({properties: this.state.properties});
    }

    onDeleteClause = (index) => {
        if (this.state.properties.length <= 1) {
            return;
        }
        this.state.properties.splice(index, 1);
        this.setState({properties: this.state.properties});
    }

    onFieldNameChange = (event, index) => {
        var newClauses = this.state.properties.slice();
        newClauses[index].Key = event.target.value;
        this.setState({properties: newClauses});
    }

    onFieldValueChange = (event, index) => {
        var newClauses = this.state.properties.slice();
        newClauses[index].Value = event.target.value;
        this.setState({properties: newClauses});
    }

    onTypeChange = (event, index) => {
        var newClauses = this.state.properties.slice();
        newClauses[index].Type = event.target.value;
        this.setState({properties: newClauses});
    }

    cancel = () => {
        this.props.onClose();
    }

    save = () => {
        const valid = this.state.properties.every((c) => c.Key.trim() !== '' && c.Value.trim() !== '');
        if (!valid) {
            this.setState({message: 'Incorrect filed name or value.'});
        } else {
            Http.post(Config.uiConfigApiUrl + '/api/v1/profilegroups/' + this.state.profileName, this.state.properties)
                .then((data) => {
                    this.props.onClose();
                    EventTopic.publish(Topics.profile.changed, null, this);
                }).catch((err) => {
                    this.setState({ message: 'Failed to save profile due to: ' + err.message });
                });
        }
    }

    render() {
        const dataTypes = ['Number', 'String', 'Boolean'];
        const rows = this.state.properties.map((c, i) => {
             return (
                <tr key={i}>
                    <td>
                        <input className="form-control"  style={{ width: "280px" }} type="text" value={c.Key} placeholder='twin name, e.g. tags.location' onChange={ (event) => this.onFieldNameChange(event, i) } />
                    </td>
                    <td>
                        <input className="form-control" style={{ width: "280px" }} value={c.Value} onChange={ (event) => this.onFieldValueChange(event, i) }  />
                    </td>
                    <td>
                        <select className="form-control" value={c.Type} onChange={(event) => this.onTypeChange(event, i) }>
                            {
                            dataTypes.map((type) =>
                                <option key={type} value={type}>{type}</option>)
                            }
                        </select>
                    </td>
                    <td>
                        <button className="btn btn-default" style={{ marginLeft: "5px" }} title="Add" onClick={this.onNewClause}>+</button>
                        <button className="btn btn-default" style={{ marginLeft: "5px"}} title="Delete" onClick={() => this.onDeleteClause(i) }>-</button>
                    </td>
                </tr>
            );
        });

        return (
            <div className="profileEditorTile">
                <div className= "profileEditorLabel">
                    <label>Group Name</label>
                    <input className="form-control" style={{ width: "500px" }} value={this.state.groupName} placeholder={lang.PROFILE.NAME_PLACEHOLDER} onChange={this.onProfileNameChange} />
                </div>
                <div className="profileEditorTable">
                    <table>
                        <thead>
                            <tr><td>Field</td><td>Value</td><td>Type</td></tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
                <div className="profileEditorControls">
                    <p className="profileEditorWarning">{this.state.message}</p>
                    <button className="btn btn-default profileEditorButton" onClick={this.save}>Save</button>
                    <button className="btn btn-default profileEditorButton" style={{ marginRight:"10px" }} onClick={this.cancel}>Cancel</button>
                </div>
            </div>
        );
    }
}

export default ProfileEditor
