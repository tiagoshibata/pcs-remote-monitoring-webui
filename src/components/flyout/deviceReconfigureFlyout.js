// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import JsonEditor from '../jsonEditor/jsonEditor';
import lang from '../../common/lang';
import * as actions from '../../actions';
import { getDeviceProfiles } from '../../actions/manageProfilesFlyoutActions';
import * as uuid from 'uuid/v4';
import CancelX from '../../assets/icons/CancelX.svg';
import Apply from '../../assets/icons/Apply.svg';
import ApiService from '../../common/apiService';
import EventTopic, { Topics } from '../../common/eventtopic';
import Spinner from '../spinner/spinner';
import DeepLinkSection from '../deepLinkSection/deepLinkSection';
import PcsBtn from '../shared/pcsBtn/pcsBtn';
import SummarySection from '../shared/summarySection/summarySection';
import GenericDropDownList from '../../components/genericDropDownList/genericDropDownList';
import ProfileEditorFlyout from './profileEditorFlyout';
import Schema from '../../schema/schema';
import './deviceReconfigureFlyout.css';


class DeviceReconfigureFlyout extends React.Component {
  constructor() {
    super();
    this.subscriptions = [];
    this.state = {
      desiredProperties: {},
      jobName: '',
      jobApplied: false
    };

    this.onJobNameChange = this.onJobNameChange.bind(this);
    this.applyDeviceConfigureJobsData =this.applyDeviceConfigureJobsData.bind(this);
  }

  componentWillMount() {
    this.props.getDeviceProfiles();
  }

  componentDidMount = () => {
    this.subscriptions.push(EventTopic.subscribe(Topics.profile.selected, (topic, id, publisher) => {
      if (!id[0]) {
        this.setState({desiredProperties: {}});
        return;
      }
      const profile = this.props.profiles.find((profile => profile.Id === id[0]));
      const desiredProperties = profile.DesiredProperties;
      this.setState({desiredProperties});
    }));
  }

  componentWillUnmount() {
    EventTopic.unsubscribe(this.subscriptions);
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
    const deepLinkSectionProps = {
      path: `/maintenance/job/${this.state.jobId}`,
      description: lang.VIEW_JOB_STATUS,
      linkText: lang.VIEW
    };
    let totalAffectedDevices = this.props.devices ? this.props.devices.length : 0;
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
        </div>

        <div className="marginTop20">
            <label>{lang.DEVICES.APPLYPROFILE}</label>
            <div className="profile-list-button">
              <GenericDropDownList
                id="Profiles"
                menuAlign="right"
                requestObjectToListModel={item => ({id: item.Id, text: item.DisplayName})}
                initialState={{
                  defaultText: lang.PROFILE_CHOOSE
                }}
                publishTopic={Topics.profile.selected}
                items={this.props.profiles}
              />
            </div>
        </div>

        <div className="jsoneditor-container">
          <JsonEditor width='100%' value={this.state.desiredProperties} options={{mode: 'tree'}} onChange={this.setProperties} ref={(editor) => { this.editor = editor; }} />
          {this.state.message && <pre className="schema-error">{this.state.message}</pre>}
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

const mapDispatchToProps = dispatch => ({
  getDeviceProfiles: () => {
    dispatch(getDeviceProfiles());
  },
  actions: bindActionCreators(actions, dispatch)
});

const mapStateToProps = state => ({
  devices: state.flyoutReducer.devices,
  profiles: state.profileReducer.profiles
});

export default connect(mapStateToProps, mapDispatchToProps)(DeviceReconfigureFlyout);
