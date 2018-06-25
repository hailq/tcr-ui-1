import { applyForListing } from '../web3';
import { setUserInfo } from './account';

export const REGISTER_APPLICATION = 'REGISTER_APPLICATION';

export function handleRegisterApplication(listing) {
  return (dispatch) => {
    applyForListing(listing, () => {
      dispatch(registerApplication(listing));
      dispatch(setUserInfo());
      console.log(`Application ${listing.username} success.`);
    })
  }
}

function registerApplication(listing) {
  console.log(listing);
  return {
    type: REGISTER_APPLICATION,
    listing
  }
}