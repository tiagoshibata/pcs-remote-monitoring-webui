// Copyright (c) Microsoft. All rights reserved.

import * as types from '../actions/actionTypes';
import initialState from './initialState';

const mapReducer = (state = initialState.dashboard.map, action) => {
  switch (action.type) {
    case types.LOAD_MAPKEY_SUCCESS:
      return {
        ...state,
        BingMapKey: action.BingMapKey
      };

    default: return state;
  }
};

export default mapReducer;
