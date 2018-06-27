import {
  REGISTER_APPLICATION,
  GET_INITIAL_APPLICATIONS,
} from '../actions/applications';

export default function applications(state={}, action) {
  switch (action.type) {
    case REGISTER_APPLICATION:
      return {
        ...state,
        [action.listing.username]: action.listing
      };
    case GET_INITIAL_APPLICATIONS:
      const newState = Object.assign(action.applications, state);
      return {
        ...newState
      };
    default:
      return state;
  }
}