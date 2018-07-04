import { applyForListing, getPastEvents, getListings } from '../web3';
import { setUserInfo } from './account';
import { _APPLICATION } from '../events';

export const REGISTER_APPLICATION = 'REGISTER_APPLICATION';
export const GET_INITIAL_APPLICATIONS = 'GET_INITIAL_APPLICATIONS';

export function handleRegisterApplication(listing) {
  return (dispatch) => {
    applyForListing(listing, () => {
      dispatch(registerApplication(listing));
      dispatch(setUserInfo());
      console.log(`Application ${listing.listingName} success.`);
    })
  }
}

export function handleGetInitialApplications() {
  return (dispatch) => {
    getPastEvents(_APPLICATION, (applications) => {
      getListings(applications, (listings) => {
        let apps = {};

        for (let i = 0; i < listings.length; i++) {
          if (listings[i].owner != 0) { // filtered out removed listings
            const app = {
              ...applications[i].returnValues,
              ...listings[i]
            };
            apps[app.listingHash] = app;
          }
        }

        dispatch(getInitialApplications(apps));
      })
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