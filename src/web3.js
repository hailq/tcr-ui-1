import Web3 from 'web3'


import * as registryContract from './Registry.json'
import * as tokenContract from './EIP20.json'

// const Web3 = require('web3')
// const fs = require('fs');
// const ethUtil = require('ethereumjs-util');

const contractLocation = './Registry.json';
const tokenLocation = './EIP20.json';
const plcrLocation = './PLCRVoting.json';

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

export const registryAddress = '0x1ff158f2016fc24f190de18923c1fb170028c500';// registryAddress got from 'Registry.address' in truffle console.
export const tokenAddress = '0x57ac1f946ca078b9defc74d9296d81f3c0386f7e';
export const plcrAddress = '0xf0b0e1721d4a08a6bc73928c5ff415dddac4ebd0';

// Get an instance of the registry contract
// const registryContract = JSON.parse(registry);
const registryAbi = registryContract.abi;
export const registryInstance = new web3.eth.Contract(registryAbi, registryAddress);

// Get an instance of the token contract

// const tokenContract = JSON.parse(fs.readFileSync(tokenLocation, 'utf8'));
const tokenAbi = tokenContract.abi;
export const tokenInstance = new web3.eth.Contract(tokenAbi, tokenAddress);

// // Get an instance of the PLCR contract
// const plcrContract = JSON.parse(fs.readFileSync(plcrLocation, 'utf8'));
// const plcrAbi = plcrContract.abi;
// const plcrInstance = new web3.eth.Contract(plcrAbi, plcrAddress);

// ganache addresses
export const CLIENT_ADDRESS1 = "0xB6984c37e20C1b9CD4Afe48Cdb2f41DA5b0cEf39";
export const CLIENT_ADDRESS2 = "0x039A8793760570c0FAF38e219D01a5a43951CD44";
export const CLIENT_ADDRESS3 = "0x80691958C54a51B97C696bB20517C3e473fc757D";
export const CLIENT_ADDRESS4 = "0xc228e1f9649506468A33c73EB4fA670C3e79389B";

export const MIN_DEPOSIT = 10000000000000000000;
export const BLOCK_GAS_LIMIT = 6721975;

// // give tokens to registry
// // tokenInstance.methods.approve(registryAddress, 9 * MIN_DEPOSIT)
// //   .send({from: CLIENT_ADDRESS2, gas: BLOCK_GAS_LIMIT}, function(err, result) {
// //     if (err) {
// //       console.log(err);
// //     } else {
// //       console.log('Result: ', result);
// //     }
// //   })

// // // web3.eth.getBlock("latest").then(function(result) {
// // //   console.log(result)
// // // })

// // // apply for a listing
// // listingName = 'meo01';
// // hashedListingName = '0x' + ethUtil.sha3(listingName, 256).toString('hex');
// // registryInstance.methods.apply(hashedListingName, MIN_DEPOSIT, "meomeomeo")
// //   .send({from: CLIENT_ADDRESS2, gas: BLOCK_GAS_LIMIT}, function(err, result) {
// //     if (err) console.log('ERR: ', err);
// //     else console.log(result);
// //   });




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
// // tokenInstance.methods.approve(registryAddress, 20 * MIN_DEPOSIT).send({from: CLIENT_ADDRESS1});
// // tokenInstance.methods.approve(registryAddress, 20 * MIN_DEPOSIT).send({from: CLIENT_ADDRESS2});

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


