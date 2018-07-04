import {
  GET_INITIAL_CHALLENGES
} from '../actions/challenges';

export default function challenges(state={}, action) {
  switch (action.type) {
    case GET_INITIAL_CHALLENGES:
      const newState = Object.assign(action.challenges, state);
      return {
        ...newState
      };
    default:
      return state;
  }
}