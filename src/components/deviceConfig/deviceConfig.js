// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import {Button} from "react-bootstrap";
import GenericDropDownList from '../../components/genericDropDownList/genericDropDownList';
import ProfileEditor from '../../components/profileEditor/profileEditor';
import {formatString, isFunction} from "../../common/utils";
import * as uuid from "uuid/v4"
import lang from "../../common/lang";
import DeviceProperty from "../deviceProperty/deviceProperty";
import Config from "../../common/config";
import ApiService from "../../common/apiService";

import "./deviceConfig.css";


const DefaultExecutionTime = 0;

class DeviceConfig extends React.Component {

    onConfirm() {
        if (this.props.devices && this.props.devices.length) {
            let ids = this.props.devices.map(device => {
                return `'${device.Id}'`
            });
            let queryCondition = `deviceId in [${ids.toString()}]`;
            let configTwin = {};
            this.refs.deviceProperty.getProperty().forEach(config => {
                configTwin[config.name] = config.value;
            });
            let payload = {
                JobId: uuid(),
                QueryCondition: queryCondition,
                MaxExecutionTimeInSeconds: DefaultExecutionTime,
                UpdateTwin: {
                    DesiredProperties: {
                        config: configTwin
                    }
                }
            };
            ApiService.scheduleJobs(payload)
                .catch((err)=>{
                    console.log(err);
                });
        }

        if (isFunction(this.props.finishCallback)) {
            this.props.finishCallback();
        }
    }

    render() {
        const deviceCount = this.props.devices && Array.isArray(this.props.devices) ? this.props.devices.length : 0;
        return (
            <div className="deviceConfig">
                <div className="marginTop20">
                    <label>{lang.CONFIGPROPERTIES}</label>
                    <DeviceProperty ref="deviceProperty" />
                </div>
                <div className="marginTop20">
                    <label>{lang.APPLYPROFILE}</label>
                    <div className="profile-list-button">
                      <GenericDropDownList
                        id="Profiles"
                        menuAlign="right"
                        requestUrl={Config.deviceGroupApiUrl}
                        initialState={{
                          defaultText: lang.CHOOSEPROFILE
                        }}
                        newItem={{
                          text: lang.NEWPROFILE,
                          dialog: ProfileEditor
                        }}
                        publishTopic={'foo'}
                        reloadRequestTopic={'bar'}
                      />
                    </div>
                    <label>{formatString(lang.CAUTION, deviceCount)}</label>
                    <Button className="btnConfirm" onClick={() => this.onConfirm()}>{lang.CONFIRM}</Button>
                </div>
            </div>
        );
    }
}

export default DeviceConfig;
