import { REGISTER_APPLICATION } from '../actions/applications'

export default function applications(state={}, action) {
  switch (action.type) {
    case REGISTER_APPLICATION:
      return {
        ...state,
        [action.applicationName]: {
          name: action.applicationName,
        }
      };
    default:
      return state;
  }
}