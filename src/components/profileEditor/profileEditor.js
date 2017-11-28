// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { connect } from 'react-redux';
import DMWizard from "../dmWizard/dmWizard";
import lang from "../../common/lang";
import Schema from '../../schema/schema';
import { saveOrUpdateProfile } from '../../actions/profileEditorActions';
import JsonEditor from '../jsonEditor/jsonEditor';

import './profileEditor.css';

const isObject = x => x && typeof x === 'object' && !Array.isArray(x);

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

    checkJsonInput = event => {
      let json;
      try {
          json = JSON.parse(event.target.value);
      } catch (e) {
          this.setState({message: 'JSON document is invalid'});
          return;
      }

      const error = Schema.validateDesiredProperties(json);
      if (error !== null) {
          this.setState({message: error});
          return;
      }
      this.setState({jsonInput: json, message: null});  /// FIXME use separate message state variables
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
                <div className="DMWizard">
                    <DMWizard />
                </div>
                <div className="profileEditorTable">
                    <div>
                      <button className="btn btn-default">
                        <label>
                          Upload a JSON document
                          <input type="file" style={{position: 'fixed', top: '-100em'}} onChange={this.mergeJsonInput} />
                        </label>
                      </button>
                    </div>
                    <JsonEditor ref={(editor) => { this.jsonEditor = editor; }} value={this.state.DesiredProperties} options={{mode: "tree"}} width='100%' height='500px' onChange={this.setProperties} />
                    <textarea placeholder="Merge JSON document with editor" onChange={this.checkJsonInput}></textarea>
                </div>
                <div>
                    <button className="btn btn-default profileEditorButton" onClick={this.save} disabled={this.state.message !== null}>Save</button>
                    <button className="btn btn-default profileEditorButton" style={{ marginRight:"10px" }} onClick={this.props.onClose}>Cancel</button>
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

export default connect(null, mapDispatchToProps)(ProfileEditor);
