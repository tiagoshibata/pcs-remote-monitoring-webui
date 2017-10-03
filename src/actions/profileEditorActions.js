// Copyright (c) Microsoft. All rights reserved.

import * as types from './actionTypes';
import { loadFailed } from './ajaxStatusActions';
import ApiService from '../common/apiService';

export const saveOrUpdateProfile = profile => {
  return (dispatch, getState) => {
    if (!profile.Id) {
      return ApiService.postProfile(profile)
        .then(data => {
          dispatch({
            type: types.MANAGE_PROFILES_FLYOUT_SAVE_SUCCESS,
            data: data
          });
        })
        .catch(error => {
          dispatch(loadFailed(error));
          throw error;
        });
    } else {
      return ApiService.updateProfile(profile)
        .then(data => {
          dispatch({
            type: types.MANAGE_PROFILES_FLYOUT_UPDATE_SUCCESS,
            data: data
          });
        })
        .catch(error => {
          dispatch(loadFailed(error));
          throw error;
        });
    }
  };
};
