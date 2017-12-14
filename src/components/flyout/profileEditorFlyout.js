// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { connect } from 'react-redux';
import PcsBtn from '../shared/pcsBtn/pcsBtn'
import lang from "../../common/lang";
import Schema from '../../schema/schema';
import { saveOrUpdateProfile } from '../../actions/profileEditorActions';
import JsonEditor from '../jsonEditor/jsonEditor';

import './profileEditorFlyout.css';
import 'jsoneditor/examples/css/darktheme.css'
const isObject = x => x && typeof x === 'object' && !Array.isArray(x);

class ProfileEditorFlyout extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        const profile = props.content && props.content.profile;
        if (profile) {
            this.state = {
                Id: profile.Id,
                ETag: profile.ETag,
                DisplayName: profile.DisplayName,
                DesiredProperties: profile.DesiredProperties
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
      this.setState({DesiredProperties: properties, message: Schema.validateDesiredProperties(properties)});
    }

    mergeObjects(target, source) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (!isObject(target[key])) {
            target[key] = source[key];
          } else {
            this.mergeObjects(target[key], source[key]);
          }
        } else {
          target[key] = source[key];
        }
      }

      return target;
    }

    mergeJsonInput = event => {
      const fileReader = new FileReader();
      fileReader.onload = evt => {
        let jsonData;
        try {
          jsonData = JSON.parse(evt.target.result);
          console.assert(isObject(jsonData));
        } catch (e) {
          this.setState({message: "File doesn't have a valid JSON object"});
          return;
        }
        const mergedObject = this.mergeObjects(this.state.DesiredProperties, jsonData);
        this.setState({DesiredProperties: mergedObject});
      };
      fileReader.readAsText(event.target.files[0]);
    }

    onProfileNameChange = event => {
        this.setState({ DisplayName: event.target.value });
    }

    save = () => {
        if (Schema.validateDesiredProperties(this.state.DesiredProperties) !== null) {
            return;
        }
        const profile = {
            DisplayName: this.state.DisplayName,
            DesiredProperties: this.state.DesiredProperties,
        }
        if (this.state.Id && this.state.ETag) {
            profile.Id = this.state.Id;
            profile.ETag = this.state.ETag;
        }
        this.props.saveOrUpdateProfile(profile);
        this.props.onClose();
    }

    render() {
        return (
            <div className="profileEditorTile">
                <div className= "profileEditorLabel">
                    <label>{lang.PROFILE_NAME}</label>
                    <input className="form-control" style={{ width: "500px" }} value={this.state.DisplayName} placeholder={lang.PROFILE_NAME_PLACEHOLDER} onChange={this.onProfileNameChange} />
                </div>
                <div>
                    <div className="dialog-buttons">
                      <PcsBtn>
                        <label>
                          Upload a JSON document
                          <input type="file" style={{position: "fixed", top: "-100em"}} onChange={this.mergeJsonInput} />
                        </label>
                      </PcsBtn>
                    </div>
                    <JsonEditor ref={(editor) => { this.jsonEditor = editor; }} value={this.state.DesiredProperties} options={{mode: "tree"}} width="100%" height="500px" onChange={this.setProperties} />
                </div>
                <div className="dialog-buttons">
                    <PcsBtn onClick={this.save} disabled={this.state.message !== null} className="save">Save</PcsBtn>
                    <PcsBtn onClick={this.props.onClose} className="cancel-button">Cancel</PcsBtn>
                </div>
                <div>
                    {this.state.message && <pre className="profileEditorWarning">{this.state.message}</pre>}
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

export default connect(null, mapDispatchToProps)(ProfileEditorFlyout);
