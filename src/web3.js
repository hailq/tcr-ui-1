import Web3 from 'web3'
import ethUtil from 'ethereumjs-util';

import * as registryContract from './Registry.json'
import * as tokenContract from './EIP20.json'
import * as plcrContract from './PLCRVoting.json';

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

const REGISTRY_ADDRESS = '0x1ff158f2016fc24f190de18923c1fb170028c500';
const TOKEN_ADDRESS = '0x57ac1f946ca078b9defc74d9296d81f3c0386f7e';
const PLCR_ADDRESS = '0xf0b0e1721d4a08a6bc73928c5ff415dddac4ebd0';

// an instance of the registry contract
const registryInstance = new web3.eth.Contract(registryContract.abi, REGISTRY_ADDRESS);
// an instance of the token contract
const tokenInstance = new web3.eth.Contract(tokenContract.abi, TOKEN_ADDRESS);
// an instance of the PLCR contract
const plcrInstance = new web3.eth.Contract(plcrContract.abi, PLCR_ADDRESS);

const MIN_DEPOSIT = 10000000000000000000;
const BLOCK_GAS_LIMIT = 4500000; //6721975;
// const acc = asoudfhaisg; 
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
  getAccount((acc) => {
    const hashedListingName = '0x' + ethUtil.sha3(JSON.stringify(listing), 256).toString('hex');
    registryInstance.methods.apply(hashedListingName, MIN_DEPOSIT, JSON.stringify(listing))
      .send({from: acc, gas: BLOCK_GAS_LIMIT}, function(err, res) {
        if (err) console.log('ERROR', err);
        else {
          callback()
        }
      });
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


