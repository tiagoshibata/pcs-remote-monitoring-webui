// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import JsonEditor from '@dr-kobros/react-jsoneditor';
import lang from '../../common/lang';
import * as actions from '../../actions';

import CancelX from '../../assets/icons/CancelX.svg';
import Apply from '../../assets/icons/Apply.svg';
import ApiService from '../../common/apiService';
import Config from '../../common/config';
import {sanitizeJobName} from '../../common/utils';
import Spinner from '../spinner/spinner';
import DeepLinkSection from '../deepLinkSection/deepLinkSection';
import { getTypeOf } from '../../common/utils';
import PcsBtn from '../shared/pcsBtn/pcsBtn';
import SummarySection from '../shared/summarySection/summarySection';
import GenericDropDownList from '../../components/genericDropDownList/genericDropDownList';
import ProfileEditor from '../../components/profileEditor/profileEditor';
import Schema from '../../schema';
import './deviceReconfigureFlyout.css';


const getRelatedJobs = (devices, propertyUpdateJobs) => {
  if (!devices || !propertyUpdateJobs || !devices.length || !propertyUpdateJobs.length) return [];
  return propertyUpdateJobs.filter(job => devices.some(({ Id }) => job.deviceIds.indexOf(Id) !== -1));
}

class DeviceReconfigureFlyout extends React.Component {
  constructor() {
    super();
    this.inputReference = {};
    this.state = {
      desiredProperties: {
        windows: {
          rebootInfo: {
            singleRebootTime: "2017-09-18T16:00:00-08:00"
          }
        }
      },
      jobName: '',
      jobApplied: false
    };

    this.onJobNameChange = this.onJobNameChange.bind(this);
    this.applyDeviceConfigureJobsData =this.applyDeviceConfigureJobsData.bind(this);
    this.checkJobStatus = this.checkJobStatus.bind(this);
  }

  onJobNameChange(event) {
    this.setState({ jobName: event.target.value });
  }

  setProperties = properties => {
    this.setState({desiredProperties: properties, message: Schema.validateDesiredProperties(properties)});
  }

  applyDeviceConfigureJobsData() {
    const { devices } = this.props;
    const deviceIds = devices.map(device => `'${device.Id}'`).join(',');
    const payload = {
      JobId: this.state.jobName ? this.state.jobName + '-' + uuid() : uuid(),
      QueryCondition: `deviceId in [${deviceIds}]`,
      updateTwin: {
        Properties: {
          Desired: this.state.desiredProperties
        }
      }
    };

    this.setState({ showSpinner: true });
    ApiService.scheduleJobs(payload).then(({ jobId }) => {
      this.props.actions.updatePropertyJobs({
        jobId,
        deviceIds: devices.map(({ Id }) => Id)
      });
      this.setState({
        showSpinner: false,
        jobApplied: true,
        jobId
      });
    });
  }

  render() {
    let totalEffectedDevices = this.props.devices ? this.props.devices.length : 0;
    const disabledButton = !this.state.jobName;
    return (
      <div className="device-configuration-container">
        <div className="sub-heading">
          {lang.CHOOSE_DEVICE_CONFIGURATION}
        </div>
        <div className="sub-class-heading">
          {lang.AVAILABLE_PROPERTIES}
        </div>
        <div className="job-name-container">
          <div className="label-key">
            {lang.JOB_NAME}
          </div>
          <input
            type="text"
            className="style-manage"
            placeholder={lang.RECONFIGURE_JOB}
            onChange={this.onJobNameChange}
            value={this.state.jobName}
          />
          <div className="jobname-reference">
            <span className="asterisk">*</span>
            {lang.JOB_NAME_REFERENCE}
        </div>

        <div className="marginTop20">
            <label>{lang.DEVICES.APPLYPROFILE}</label>
            <div className="profile-list-button">
              <GenericDropDownList
                id="Profiles"
                menuAlign="right"
                requestUrl={Config.deviceGroupApiUrl}
                initialState={{
                  defaultText: lang.DEVICES.CHOOSEPROFILE
                }}
                newItem={{
                  text: lang.DEVICES.NEWPROFILE,
                  dialog: ProfileEditor
                }}
                publishTopic={'foo'}
                reloadRequestTopic={'bar'}
              />
            </div>
        </div>

        <div className="jsoneditor-container">
          <JsonEditor width='100%' value={this.state.desiredProperties} options={{mode: 'tree'}} onChange={this.setProperties} ref={(editor) => { this.editor = editor; }} />
          <pre className="schema-error">{this.state.message}</pre>
        </div>

        <div className="summary-container">
          {lang.SUMMARY}
          <div className="affected-devices">
            <span className="num-affected-devices">
              {totalAffectedDevices}
            </span>
            <span className="affected-devices-name">
              {lang.AFFECTED_DEVICES}
            </span>
          </div>
        </div>
        {this.commonReconfigure()}
        <SummarySection count={totalAffectedDevices} content={lang.AFFECTED_DEVICES} />
        <div className="btn-container">
          <PcsBtn svg={CancelX} value={lang.CANCEL} onClick={this.props.onClose} />
          {this.state.showSpinner && <Spinner size="medium" />}
          {this.state.jobApplied
            ? <PcsBtn svg={Apply} value={lang.APPLIED} disabled />
            : <PcsBtn
                className="primary"
                svg={Apply}
                value={lang.APPLY}
                disabled={disabledButton}
                onClick={this.applyDeviceConfigureJobsData}
              /> }
        </div>
        {this.state.jobApplied ? <DeepLinkSection {...deepLinkSectionProps}/> : null}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

const mapStateToProps = state => {
  return {
    devices: state.flyoutReducer.devices,
    deviceETags: state.flyoutReducer.deviceETags || {},
    propertyUpdateJobs: state.systemStatusJobReducer.propertyUpdateJobs
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceReconfigureFlyout);
