import { applyForListing, getPastEvents, getListings } from '../web3';
import { _APPLICATION } from '../events';

export const REGISTER_APPLICATION = 'REGISTER_APPLICATION';
export const GET_INITIAL_APPLICATIONS = 'GET_INITIAL_APPLICATIONS';

export function handleRegisterApplication(listing) {
  return (dispatch) => {
    applyForListing(listing, () => {
      dispatch(handleGetInitialApplications())
      console.log(`Application ${listing.listingName} success.`);
    })
  }
}

export function handleGetInitialApplications() {
  console.log('here');
  return (dispatch) => {
    getPastEvents(_APPLICATION, (applications) => {
      getListings(applications, (listings) => {
        let apps = {};

        for (let i = 0; i < listings.length; i++) {
          if (listings[i].owner != 0) { // only consider listings that are not removed
            const returnValues = applications[i].returnValues
            const app = {
              ...returnValues,
              ...listings[i],
              data: JSON.parse(returnValues.data),
            };
            apps[app.listingHash] = app;
          }
        }
        console.log(apps);

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