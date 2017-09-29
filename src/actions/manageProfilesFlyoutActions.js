// Copyright (c) Microsoft. All rights reserved.

import * as types from './actionTypes';
import { loadFailed } from './ajaxStatusActions';
import ApiService from '../common/apiService';

export const deleteProfile = profile => {
  return (dispatch, getState) => {
    return ApiService.deleteProfile(profile)
      .then(data => {
        dispatch({
          type: types.MANAGE_PROFILES_FLYOUT_DELETE_SUCCESS,
          data: {
            id: profile.Id
          }
        });
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};

export const getDeviceProfiles = () => {
  return dispatch => {
    return ApiService.getProfiles()
      .then(data => {
        dispatch({
          type: types.LOAD_PROFILES_SUCCESS,
          data: data.items
        });
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};
