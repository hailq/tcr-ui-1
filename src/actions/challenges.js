import { getPastEvents } from '../web3';
import { _CHALLENGE } from '../events';

export const GET_INITIAL_CHALLENGES = 'GET_INITIAL_CHALLENGES';

export function handleGetInitialChallenges() {
  return (dispatch) => {
    getPastEvents(_CHALLENGE, (result) => {
      let challenges = {};
      result.forEach((challenge) => {
        const values = challenge.returnValues;
        challenges[values.challengeID] = {
          challengeID: values.challengeID,
          challenger: values.challenger,
          commitEndDate: values.commitEndDate,
          data: values.data,
          listingHash: values.listingHash,
          revealEndDate: values.revealEndDate,
        };
      })
      dispatch(getInitialChallenges(challenges))
    })
  }
}

function getInitialChallenges(challenges) {
  return {
    type: GET_INITIAL_CHALLENGES,
    challenges
  }
}