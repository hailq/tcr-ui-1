import Web3 from 'web3'
import ethUtil from 'ethereumjs-util';

import * as registryContract from './Registry.json'
import * as tokenContract from './EIP20.json'
import * as plcrContract from './PLCRVoting.json';

import {
  _APPLICATION,
  _APPLICATIONWHITELISTED,
  _LISTINGREMOVED,
  _APPLICATIONREMOVED,
  _LISTINGWITHDRAWN
} from './events';

export const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

const REGISTRY_ADDRESS = '0xd54b47f8e6a1b97f3a84f63c867286272b273b7c';
const TOKEN_ADDRESS = '0xbaaa2a3237035a2c7fa2a33c76b44a8c6fe18e87';
const PLCR_ADDRESS = '0xf328c11c4df88d18fcbd30ad38d8b4714f4b33bf';

// an instance of the registry contract
const registryInstance = new web3.eth.Contract(registryContract.abi, REGISTRY_ADDRESS);
// an instance of the token contract
const tokenInstance = new web3.eth.Contract(tokenContract.abi, TOKEN_ADDRESS);
// an instance of the PLCR contract
const plcrInstance = new web3.eth.Contract(plcrContract.abi, PLCR_ADDRESS);

const MIN_DEPOSIT = 10000000000000000000;
const BLOCK_GAS_LIMIT = 4500000; //6721975;

/* 
Export functions
*/

function getAccount(callback) {
  web3.eth.getAccounts((error, result) => {
    if (error) {
      console.log(error)
    } else {
      callback(result[0])
    }})
}

// approve tokens
export function approveTokenToRegistry(amount, callback) {
  getAccount((acc) => {
    tokenInstance.methods.approve(REGISTRY_ADDRESS, amount)
      .send({from: acc, gas: BLOCK_GAS_LIMIT}, function(err, res) {
        if (err) {
          console.log(err);
        } else {
          callback(acc)
        }
      })
  })
}

// apply for a listing
export function applyForListing(listing, callback) {
  console.log(listing);
  getAccount((acc) => {
    const hashedListingName = '0x' + ethUtil.sha3(JSON.stringify(listing), 256).toString('hex');
    registryInstance.methods.apply(hashedListingName, MIN_DEPOSIT, listing.listingName)
      .send({from: acc, gas: BLOCK_GAS_LIMIT}, function(err, res) {
        if (err) console.log('ERROR', err);
        else {
          callback()
        }
      });
  })
}

export function getPastEvents(type, callback) {
  registryInstance.getPastEvents(type, {
    fromBlock: 1,
  }, function(error, result) {
    if (error) {
      console.log(error);
    } else {
      console.log(result);
      callback(result);
    }
  })
}

export function getListings(applications) {
  Promise.all(applications.map(app => (
    registryInstance.methods.listings(app.returnValues.listingHash)
      .call()
  )))
    .then((values) => {
      console.log(values);
    })
    .catch((error) => console.log(error));
}

export function getRemovedApplications() {
  Promise.all([
    registryInstance.getPastEvents(_APPLICATIONREMOVED, {
      fromBlock: 1
    }),
    registryInstance.getPastEvents(_LISTINGREMOVED, {
      fromBlock: 1
    }),
    registryInstance.getPastEvents(_LISTINGWITHDRAWN, {
      fromBlock: 1
    }),
  ]).then(function(values) {
    console.log(values);
  })
}

//////////////////////////////////////////////////////////////////
//// User Info functions                                  ////////
//////////////////////////////////////////////////////////////////
export function getTotalEther(callback) {
  getAccount((acc) => {
    web3.eth.getBalance(acc).then(function(result) {
      const ether = web3.utils.fromWei(result, "ether");
      callback(ether);
    })
  })
}

export function getTotalToken(callback) {
  getAccount((acc) => {
    tokenInstance.methods.balanceOf(acc)
      .call(function(err, res) {
        if (err) {
          console.log(err);
        } else {
          callback(res)
        }
      })
  })
}

export function getAllowance(callback) {
  getAccount((acc) => {
    tokenInstance.methods.allowance(acc, REGISTRY_ADDRESS)
      .call(function(err, res) {
        if (err) {
          console.log(err);
        } else {
          callback(res);
        }
      })
  })
}

// event listeners

export const registryEventListener = (callback) => {
  registryInstance.events[_APPLICATION](
    callback = function(error, result) {
      if (error) {
        console.log(error);
      } else {
        callback(result);
      }
    }
  );
}

// registryInstance.methods.apply(hashedListingName, MIN_DEPOSIT, "meomeomeo")
//   .send({from: CLIENT_ADDRESS2, gas: BLOCK_GAS_LIMIT}, function(err, result) {
//     if (err) console.log('ERR: ', err);
//     else console.log(result);
//   });




// // // challenge the above listing
// // registryInstance.methods.challenge(hashedListingName, "reasoning")
// //   .send({from: CLIENT_ADDRESS1}, function(err, result) {
// //     if (err) {
// //       console.log('error: ', err);
// //     } else {
// //       console.log(result);
// //     }
// //   })

// // 
// const appName = "test06";
// var listHash = '0x' + ethUtil.sha3(appName).toString('hex');

// // // Approve
// // tokenInstance.methods.approve(REGISTRY_ADDRESS, 20 * MIN_DEPOSIT).send({from: CLIENT_ADDRESS1});
// // tokenInstance.methods.approve(REGISTRY_ADDRESS, 20 * MIN_DEPOSIT).send({from: CLIENT_ADDRESS2});

// // // Apply
// // registryInstance.methods.apply(listHash, MIN_DEPOSIT, "test02").send({from: CLIENT_ADDRESS1, gas: 450000})

// // // Challenge
// // registryInstance.methods.challenge(listHash, "nothing").send({from: CLIENT_ADDRESS1, gas: 450000})
// //   .then(function(event1, event2) {
// //     console.log(event1);
// //     console.log(event2); 
// //   });

// // Update Status:
// // registryInstance.methods.updateStatus(listHash).send({from: CLIENT_ADDRESS1, gas: 450000})
// //   .then(function(result) {
// //     console.log(result)
// //   })

// // Vote

// // 1. Request voting right
// plcrInstance.methods.requestVotingRights(1000).send({from: CLIENT_ADDRESS2, gas: BLOCK_GAS_LIMIT})
//   .then((result) => {
//     console.log(result)
//   })
//   .catch((error) => {
//     console.log('ERR:', error);
//   })

// // 2. Commit vote


