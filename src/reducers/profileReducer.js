import * as types from '../actions/actionTypes';
import initialState from './initialState';

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.MANAGE_PROFILES_FLYOUT_DELETE_SUCCESS: {
      const deletedProfileId = action.data.id;
      const newProfiles = state.profiles.filter(profile => profile.Id !== deletedProfileId);
      return {
        ...state,
        profiles: newProfiles
      };
    }

    case types.MANAGE_PROFILES_FLYOUT_SAVE_SUCCESS: {
      const newProfiles = [action.data].concat(state.profiles);
      return {
        ...state,
        profiles: newProfiles
      };
    }

    case types.MANAGE_PROFILES_FLYOUT_UPDATE_SUCCESS: {
      const updatedGroupId = action.data.Id;
      let newProfiles = state.profiles.slice();
      let updatedIndex = newProfiles.findIndex((x) => x.Id === updatedGroupId);
      newProfiles[updatedIndex] = action.data;
      return {
        ...state,
        profiles: newProfiles
      };
    }

    case types.PROFILE_CHANGED:
      return {
        ...state,
        selectedProfileId: action.data
      };

    case types.LOAD_PROFILES_SUCCESS:
      return {
        ...state,
        profiles: action.data
      };

    default:
      return {
        ...state,
        profiles: state.profiles || []
      };
  }
};
export default profileReducer;
