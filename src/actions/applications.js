import { applyForListing } from '../web3';
import { setUserInfo } from './account';

export const REGISTER_APPLICATION = 'REGISTER_APPLICATION';

export function handleRegisterApplication(applicationName) {
  return (dispatch) => {
    applyForListing(applicationName, () => {
      dispatch(registerApplication(applicationName));
      dispatch(setUserInfo());
      console.log(`Application ${applicationName} success.`);
    })
  }
}

function registerApplication(applicationName) {
  return {
    type: REGISTER_APPLICATION,
    applicationName
  }
}