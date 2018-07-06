import { apply, getPastEvents, getListings } from '../web3';
import { _APPLICATION } from '../events';

export const REGISTER_APPLICATION = 'REGISTER_APPLICATION';
export const GET_INITIAL_APPLICATIONS = 'GET_INITIAL_APPLICATIONS';

export function handleRegisterApplication(listing) {
  return (dispatch) => {
    apply(listing, () => {
      dispatch(handleGetInitialApplications())
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
          // console.log(listings[i])
          if (listings[i].owner != 0) { // only consider listings that are not removed
            const returnValues = applications[i].args
            const app = {
              ...returnValues,
              ...listings[i],
              data: JSON.parse(returnValues.data),
              appEndDate: returnValues.appEndDate.toString(),
              deposit: returnValues.deposit.toString()
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