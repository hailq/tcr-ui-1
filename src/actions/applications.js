import { apply, getPastEvents, getListings, getListing } from '../web3';
import { _APPLICATION } from '../events';

export const REGISTER_APPLICATION = 'REGISTER_APPLICATION';
export const GET_INITIAL_APPLICATIONS = 'GET_INITIAL_APPLICATIONS';
export const REMOVE_APPLICATION = 'REMOVE_APPLICATION';

// export function handleRegisterApplication(application) {
//   return (dispatch) => {
//     apply(application, () => {
//       dispatch(handleGetInitialApplications())
//       console.log(`Application ${application.listingName} success.`);
//     })
//   }
// }
// TODO: refactor this function to use getAllApplicationData.
export function handleGetInitialApplications() {
  return (dispatch) => {
    getPastEvents(_APPLICATION, (applications) => {
      let apps = {};
      applications.forEach((app) => {
        // console.log(app);
        getListing(app, (listing) => {
          console.log(app);
          if (listing.owner != 0) {
            console.log(listing);
            console.log(app);
            const returnValues = app.args;
            const app = {
              ...returnValues,
              ...listing,
              data: JSON.parse(returnValues.data),
              appEndDate: returnValues.appEndDate.toString(),
              deposit: returnValues.deposit.toString()
            };
            apps[app.listingHash] = app;
          }
        })
      })

      dispatch(getInitialApplications(apps));

      // console.log(applications);
      // getListings(applications, (listings) => {
      //   let apps = {};

      //   for (let i = 0; i < listings.length; i++) {
      //     console.log(listings[i])
      //     if (listings[i].owner != 0) { // only consider listings that are not removed
      //       const returnValues = applications[i].args
      //       const app = {
      //         ...returnValues,
      //         ...listings[i],
      //         data: JSON.parse(returnValues.data),
      //         appEndDate: returnValues.appEndDate.toString(),
      //         deposit: returnValues.deposit.toString()
      //       };
      //       apps[app.listingHash] = app;
      //     }
      //   }

      //   dispatch(getInitialApplications(apps));
      // })
    })
  }
}

function getInitialApplications(applications) {
  return {
    type: GET_INITIAL_APPLICATIONS,
    applications
  };
}

export function registerApplication(application) {
  return {
    type: REGISTER_APPLICATION,
    application: application,
  }
}

export function removeApplication(listingHash) {
  return {
    type: REMOVE_APPLICATION,
    listingHash
  }
}

// Combine information from the _Application event
// and the listings mapping into one object.
export function getAllApplicationData(application) {
  const listing = getListing(application);
  const eventReturnedValues = application.args;

  let dataJSON = eventReturnedValues.data;
  try {
    dataJSON = JSON.parse(dataJSON)
  } catch(exception) {

  }

  return {
    ...eventReturnedValues,
    ...listing,
    data: dataJSON,
    appEndDate: eventReturnedValues.appEndDate.toString(),
    deposit: eventReturnedValues.deposit.toString()
  };
}