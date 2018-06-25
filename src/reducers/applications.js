import { REGISTER_APPLICATION } from '../actions/applications'

// some default listings
const initState = {
  listing1: {
    username: 'Listing 1',
    registry: 1,
    credential: 1,
    deposit: 1,
    metadata: 1
  },
  listing2: {
    username: 'Listing 2',
    registry: 2,
    credential: 2,
    deposit: 2,
    metadata: 2
  },
  listing3: {
    username: 'Listing 3',
    registry: 3,
    credential: 3,
    deposit: 3,
    metadata: 3
  }
}

export default function applications(state=initState, action) {
  switch (action.type) {
    case REGISTER_APPLICATION:
      return {
        ...state,
        [action.listing.username]: action.listing
      };
    default:
      return state;
  }
}