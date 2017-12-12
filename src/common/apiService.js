// Copyright (c) Microsoft. All rights reserved.

import Http from './httpClient';
import Config from './config';
import _ from 'lodash';
import { typeComputation } from './utils';

function getGroupData(group) {
  const data = {
    Id: group.Id,
    DisplayName: group.DisplayName,
    ETag: group.ETag
  };
  data.Conditions = _.cloneDeep(group.Conditions) || [];
  data.Conditions.forEach(cond => {
    delete cond.type;
  });
  return data;
}

function postGroupData(group) {
  const data = {
    DisplayName: group.DisplayName
  };
  data.Conditions = _.cloneDeep(group.Conditions) || [];
  return data;
}

function profileData(profile) {
  const data = {
    DisplayName: profile.DisplayName
  };
  data.DesiredProperties = _.cloneDeep(profile.DesiredProperties) || [];
  if (profile.Id && profile.ETag) {
    data.Id = profile.Id;
    data.ETag = profile.ETag;
  }
  return data;
}

class ApiService {
  static getCurrentUser() {
    return Http.get(`${Config.authApiUrl}users/current`);
  }

  static getAllMessages() {
    return Http.get(`${Config.telemetryApiUrl}messages`);
  }

  static getAllDevices() {
    return Http.get(`${Config.iotHubManagerApiUrl}devices`);
  }

  static getDeviceById(id) {
    return Http.get(`${Config.iotHubManagerApiUrl}devices/${id}`);
  }

  static getDevicesForGroup(selectedGroupConditions) {
    let encodedParam;
    if (!selectedGroupConditions) {
      encodedParam = '';
    } else {
      encodedParam = encodeURIComponent(JSON.stringify(selectedGroupConditions));
    }
    return Http.get(`${Config.iotHubManagerApiUrl}devices?query=${encodedParam}`);
  }

  static getAlarmsList(from, to, deviceIds) {
    const paramsMap = {
      Order: 'desc',
      from,
      to
    };
    if (deviceIds) paramsMap.devices = deviceIds;
    return ApiService.getAlarms(paramsMap);
  }

  static getAlarmsListForDeviceMap(deviceIds) {
    return Http.get(`${Config.telemetryApiUrl}alarms?devices=${deviceIds}&from=NOW-PT30M&to=NOW`);
  }

  static loadTelemetryMessagesByDeviceIds(deviceIds) {
    const csvIds = deviceIds.reduce((prevStr, id) => {
      return (prevStr ? prevStr + ',' : '') + encodeURIComponent(id);
    });
    return Http.get(`${Config.telemetryApiUrl}messages?devices=${csvIds}`);
  }

  static getTelemetryMessageByDeviceIdP1M(deviceId) {
    return Http.get(
      `${Config.telemetryApiUrl}messages?from=NOW-PT1M&to=NOW&order=desc&devices=${encodeURIComponent(deviceId)}`
    );
  }

  static loadTelemetryMessages() {
    return Http.get(`${Config.telemetryApiUrl}messages?order=desc`);
  }

  static getTelemetryMessagesP1M() {
    return Http.get(`${Config.telemetryApiUrl}messages?from=NOW-PT1M&to=NOW&order=desc`);
  }

  /**
   * Get list of telemetry messages
   *
   * @param params An object containing API parameters
   *    "from": The ISO8601 format start of the time window for the query.
   *    "to": The ISO8601 format end of the time window for the query.
   *    "order": Whether to sort the result from the oldest (asc) or the most recent (desc)
   *    "skip": How many records to skip, used to paginate through the global list of messages
   *    "limit": How many records to return, used to paginate through the global list of messages
   *    "devices": A filter used to request messages for specific devices
   */
  static getTelemetryMessages(params = {}) {
    return Http.get(`${Config.telemetryApiUrl}messages?${ApiService.serializeParamObject(params)}`);
  }

  static getAlarmsByRuleForKpi(from, to, deviceIds) {
    const paramsMap = {
      from,
      to
    };
    if (deviceIds) paramsMap.devices = deviceIds;
    return Http.get(`${Config.telemetryApiUrl}alarmsbyrule?${ApiService.serializeParamObject(paramsMap)}`);
  }

  static getAlarmList() {
    return Http.get(`${Config.telemetryApiUrl}alarmsbyrule`);
  }

  static getRuleList(params = '') {
    return Http.get(`${Config.telemetryApiUrl}rules/${params}`);
  }

  static updateRule(id, rule) {
    return Http.put(`${Config.telemetryApiUrl}rules/${id}`, rule);
  }

  static deleteRule(id) {
    return Http.delete(`${Config.telemetryApiUrl}rules/${id}`);
  }

  static deleteDevice(id) {
    if (!id) {
      throw new Error('expected valid device id');
    }
    return Http.delete(`${Config.iotHubManagerApiUrl}devices/${id}`);
  }

  /**
   * Get list of alarms
   *
   * @param params An object containing API parameters
   *    "from": The ISO8601 format start of the time window for the query.
   *    "to": The ISO8601 format end of the time window for the query.
   *    "order": Whether to sort the result from the oldest (asc) or the most recent (desc)
   *    "skip": How many records to skip, used to paginate through the global list of alarms
   *    "limit": How many records to return, used to paginate through the global list of alarms
   *    "devices": A filter used to request alarms for specific devices
   */
  static getAlarms(params = {}) {
    return Http.get(`${Config.telemetryApiUrl}alarms?${ApiService.serializeParamObject(params)}`);
  }

  /**
   * Get list of alarms aggregated by rule
   *
   * @param params An object containing API parameters
   *    "from": The ISO8601 format start of the time window for the query.
   *    "to": The ISO8601 format end of the time window for the query.
   *    "order": Whether to sort the result from the oldest (asc) or the most recent (desc)
   *    "skip": How many records to skip, used to paginate through the global list of alarms
   *    "limit": How many records to return, used to paginate through the global list of alarms
   *    "devices": A filter used to request alarms for specific devices
   */
  static getAlarmsByRule(params = {}) {
    return Http.get(`${Config.telemetryApiUrl}alarmsbyrule?${ApiService.serializeParamObject(params)}`);
  }

  static getAlarmListByRule(id, params = {}) {
    return Http.get(`${Config.telemetryApiUrl}alarmsbyrule/${id}?${ApiService.serializeParamObject(params)}`);
  }

  static getRegionByDisplayName() {
    return Http.get(`${Config.configApiUrl}devicegroups`).then(data => {
      if (data && data.items) {
        data.items.forEach(group => {
          const conditions = group.conditions || [];
          conditions.forEach(typeComputation);
        });
      }
      return data;
    });
  }

  static updateManageFiltersFlyout(group) {
    if (!group) {
      throw new Error('expected valid group object');
    }
    const data = getGroupData(group);

    return Http.put(`${Config.configApiUrl}devicegroups/${group.Id}`, data);
  }

  static postManageFiltersFlyout(group) {
    if (!group) {
      throw new Error('expected valid group object');
    }
    const data = postGroupData(group);
    return Http.post(`${Config.configApiUrl}devicegroups`, data);
  }

  static updateProfile(profile) {
    if (!profile) {
      throw new Error('expected valid profile object');
    }
    const data = profileData(profile);

    return Http.put(`${Config.configApiUrl}profiles/${profile.Id}`, data);
  }

  static postProfile(profile) {
    if (!profile) {
      throw new Error('expected valid profile object');
    }
    const data = profileData(profile);
    return Http.post(`${Config.configApiUrl}profiles`, data);
  }

  static updateDeviceTagValue(device, newTagValueMap) {
    if (!device) {
      throw new Error('expected valid group object');
    }
    const escapedId = encodeURIComponent(device.Id);
    const data = {
      Id: device.Id,
      Etag: device.Etag,
      tags: {
        ...device.tags,
        ...newTagValueMap
      }
    };
    return Http.put(`${Config.iotHubManagerApiUrl}devices/${escapedId}`, data);
  }

  static deleteManageFiltersFlyout(group) {
    if (!group) {
      throw new Error('expected valid group object');
    }
    return Http.delete(`${Config.configApiUrl}devicegroups/${group.Id}`);
  }

  static deleteProfile(profile) {
    if (!profile) {
      throw new Error('expected valid profile object');
    }
    return Http.delete(`${Config.configApiUrl}profiles/${profile.Id}`);
  }

  static serializeParamObject(params) {
    return Object.keys(params)
      .map(param => `${encodeURIComponent(param)}=${encodeURIComponent(params[param])}`)
      .join('&');
  }

  static createRule(rule) {
    return Http.post(`${Config.telemetryApiUrl}rules`, rule);
  }

  static scheduleJobs(payload) {
    return Http.post(`${Config.iotHubManagerApiUrl}jobs`, payload);
  }

  static getJobStatus(id) {
    return Http.get(`${Config.iotHubManagerApiUrl}jobs/${id}?includeDeviceDetails=true`);
  }

  static getDeviceGroupFilters() {
    return Http.get(`${Config.configApiUrl}devicegroupfilters`);
  }

  static getMapKey() {
    return Http.get(`${Config.configApiUrl}solution-settings/theme`);
  }

  static getProfiles() {
    return Http.get(`${Config.configApiUrl}profiles`);
  }

  static updateAlarmsStatus(payload) {
    return Http.patch(`${Config.telemetryApiUrl}alarms/${encodeURIComponent(payload.id)}`, payload);
  }
}

export default ApiService;
