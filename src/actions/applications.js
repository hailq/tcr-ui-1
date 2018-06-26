import { applyForListing, getPastEvents } from '../web3';
import { setUserInfo } from './account';
import { _APPLICATION } from '../events';

export const REGISTER_APPLICATION = 'REGISTER_APPLICATION';
export const GET_INITIAL_APPLICATIONS = 'GET_INITIAL_APPLICATIONS';

export function handleRegisterApplication(listing) {
  return (dispatch) => {
    applyForListing(listing, () => {
      // dispatch(registerApplication(listing));
      dispatch(setUserInfo());
      console.log(`Application ${listing.username} success.`);
    })
  }
}

export function handleGetInitialApplications() {
  return (dispatch) => {
    getPastEvents(_APPLICATION, (result) => {
      const apps = {};
      result.forEach((app) => {
        apps[app.returnValues.listingHash] = {
          listingHash: app.returnValues.listingHash,
          data: app.returnValues.data,
          appEndDate: app.returnValues.appEndDate,
          deposit: app.returnValues.deposit,
          applicant: app.returnValues.applicant
        };
      });
      console.log(apps);
      dispatch(getInitialApplications(apps));
    })
  }
}

function registerApplication(listing) {
  return {
    type: REGISTER_APPLICATION,
    listing
  };
}

function getInitialApplications(applications) {
  return {
    type: GET_INITIAL_APPLICATIONS,
    applications
  };
}