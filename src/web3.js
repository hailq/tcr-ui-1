import Web3 from 'web3';

import * as registryContract from './Registry.json'
import * as tokenContract from './EIP20.json'
import * as plcrContract from './PLCRVoting.json';

import { createSalt } from './utils';

export const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

const REGISTRY_ADDRESS = '0x1ff158f2016fc24f190de18923c1fb170028c500';
// const EIP20_ADDRESS = '0x57ac1f946ca078b9defc74d9296d81f3c0386f7e';
// const PLCR_ADDRESS = '0xf0b0e1721d4a08a6bc73928c5ff415dddac4ebd0';

export const registryInstance = web3.eth.contract(registryContract.abi).at(REGISTRY_ADDRESS);
const tokenInstance = web3.eth.contract(tokenContract.abi).at(registryInstance.token());
const votingInstance = web3.eth.contract(tokenContract.abi).at(registryInstance.voting());

const acc = web3.eth.accounts[0];
const MIN_DEPOSIT = 10000000000000000000;
const BLOCK_GAS_LIMIT = 4500000; //6721975;

/* 
Contract functions
*/

export function approve(target, amount, callback) {
  const address = target === "registry" ? REGISTRY_ADDRESS : registryInstance.voting();
  tokenInstance.approve(REGISTRY_ADDRESS, MIN_DEPOSIT,
    {from: acc},
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        if (target !== "registry") {
          votingInstance.requestVotingRights(amount, 
            {from: acc, gas: BLOCK_GAS_LIMIT},
            (error, result) => {
              if (error) {
                console.log(error);
              } else {
                callback();
              }
            })
        } else {
          callback();
        }
      }
    }
  );
}

export function apply(listing, callback) {
  const hashedListingName = web3.sha3(listing.listingName);
  registryInstance.apply(hashedListingName, MIN_DEPOSIT, JSON.stringify(listing), {
    from: acc, gas: BLOCK_GAS_LIMIT, 
  }, callback);
}

export function challenge(listingHash, data, callback) {
  registryInstance.challenge(listingHash, data, 
    {from: acc, gas: BLOCK_GAS_LIMIT},
    callback
  )
}

export function commitVote(listingHash, challengeID, challenge, vote, callback) {
  const salt = createSalt();
  // const secretHash = web3.utils.soliditySha3({type: 'uint', value: vote}, {type: 'uint', value: salt});
  const secretHash = web3.sha3()

  let prevPollID = votingInstance.getInsertPointForNumTokens(acc, MIN_DEPOSIT, challengeID)

  votingInstance.commitVote(challengeID, secretHash, MIN_DEPOSIT, prevPollID,
    {from: acc, gas: BLOCK_GAS_LIMIT},
    (error, result) => {
      const voteJSON = {
        voteOption: vote,
        numTokens: MIN_DEPOSIT,
        commitEnd: challenge.commitEndDate.toLocaleString(),
        revealEnd: challenge.revealEndDate.toLocaleString(),
        listingID: listingHash,
        salt: salt,
        pollID: challengeID.toString(),
        secretHash: secretHash,
        account: acc
      }
      console.log(voteJSON);
      callback(error, voteJSON);
    }
  )
}

export function revealVote(voteJSON) {
  votingInstance.methods.revealVote(voteJSON.pollID, voteJSON.voteOption, voteJSON.salt,
    {from: acc, gas: BLOCK_GAS_LIMIT}
  );
}

export function updateStatus(listingHash, callback) {
  registryInstance.updateStatus(listingHash,
    {from: acc, gas: BLOCK_GAS_LIMIT},
    callback
  );
}

export function exit(listingHash, callback) {
  registryInstance.exit(listingHash,
    {from: acc, gas: BLOCK_GAS_LIMIT},
    callback
  );
}

export function getPastEvents(type, callback) {
  const event = registryInstance[type]({}, {fromBlock: 0})
    .get((error, result) => {
      if (error) {
        console.log(error);
      } else {
        callback(result);
      }
    })
}

export function getListings(applications, callback) {
  Promise.all(applications.map(app => (
    registryInstance.listings(app.returnValues.listingHash)
  )))
    .then((values) => {
      callback(values);
    })
    .catch((error) => console.log(error));
}

//////////////////////////////////////////////////////////////////
//// User Info functions                                  ////////
//////////////////////////////////////////////////////////////////
export function getTotalEther() {
  return web3.fromWei(web3.eth.getBalance(acc));
}

export function getTotalToken() {
  return tokenInstance.balanceOf(acc);
}

export function getAllowance() {
  return tokenInstance.allowance(acc, REGISTRY_ADDRESS);
}



/* import Web3 from 'web3';
import ethUtil from 'ethereumjs-util';

import * as registryContract from './Registry.json'
import * as tokenContract from './EIP20.json'
import * as plcrContract from './PLCRVoting.json';

import { createSalt } from './utils';

export const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

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

 
// Export functions

function getAccount(callback) {
  web3.eth.getAccounts((error, result) => {
    if (error) {
      console.log(error)
    } else {
      callback(result[0])
    }})
}

// approve tokens to registry or plcr contract
export function approveToken(target, amount, callback) {
  const address = target === "registry" ? REGISTRY_ADDRESS : PLCR_ADDRESS;
  getAccount((acc) => {
    tokenInstance.methods.approve(address, amount)
      .send({from: acc, gas: BLOCK_GAS_LIMIT}, function(err, res) {
        if (err) {
          console.log(err);
        } else {
          if (target !== "registry") {
            plcrInstance.methods.requestVotingRights(amount)
              .send({from: acc, gas: BLOCK_GAS_LIMIT}, (error, result) => {
                if (error) {
                  console.log(error);
                } else {
                  callback();
                }
              })
          } else {
            callback();
          }
        }
      })
  })
}

// apply for a listing
export function applyForListing(listing, callback) {
  getAccount((acc) => {
    const hashedListingName = '0x' + ethUtil.sha3(listing.listingName, 256).toString('hex');
    registryInstance.methods.apply(hashedListingName, MIN_DEPOSIT, JSON.stringify(listing))
      .send({from: acc, gas: BLOCK_GAS_LIMIT}, function(err, res) {
        if (err) console.log('ERROR', err);
        else callback();
      });
  })
}

export function challenge(listingHash, data, callback) {
  getAccount((acc) => {
    registryInstance.methods.challenge(listingHash, data)
      .send({from: acc, gas: BLOCK_GAS_LIMIT}, function(err, res) {
        if (err) console.log('ERROR', err);
        else callback(res);
      })
  })
}

export function commitVote(listingHash, challengeID, challenge, vote, callback) {
  // console.log(listingHash, challengeID, challenge, vote);

  getAccount((acc) => {
    // vote = vote.toString();
    const salt = createSalt();
    const secretHash = web3.utils.soliditySha3({type: 'uint', value: vote}, {type: 'uint', value: salt});

    plcrInstance.methods.getInsertPointForNumTokens(
      acc, MIN_DEPOSIT, challengeID
    ).call(function(error, prevPollID) {
      plcrInstance.methods.commitVote(
        challengeID,
        secretHash,
        MIN_DEPOSIT,
        prevPollID
      )
      .send({from: acc, gas: BLOCK_GAS_LIMIT}, function(err, res) {
        // const voteOption = parseInt(vote, 10);
        const voteJSON = {
          voteOption: vote,
          numTokens: MIN_DEPOSIT,
          commitEnd: challenge.commitEndDate.toLocaleString(),
          revealEnd: challenge.revealEndDate.toLocaleString(),
          listingID: listingHash,
          salt: salt,
          pollID: challengeID.toString(),
          secretHash: secretHash,
          account: acc
        }
        console.log(voteJSON);

        if (err) console.log(err);
        else callback(voteJSON);
      })
    })
  })
}

export function revealVote(voteJSON) {
  // console.log(voteJSON);
  // console.log(voteJSON.revealEnd - Date.now() / 1000);
  getAccount((acc) => {
    plcrInstance.methods.revealVote(
      voteJSON.pollID,
      voteJSON.voteOption,
      voteJSON.salt
    ).send({from: acc, gas: BLOCK_GAS_LIMIT})
  })
}

export function updateStatus(listingHash, callback) {
  getAccount((acc) => {
    registryInstance.methods.updateStatus(listingHash)
      .send({from: acc, gas: BLOCK_GAS_LIMIT}, function(err, res) {
        if (err) console.log('ERROR', err);
        else callback(res);
      })
  })
}

export function exit(listingHash, callback) {
  getAccount((acc) => {
    registryInstance.methods.exit(listingHash).send(
      {from: acc, gas: BLOCK_GAS_LIMIT},
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          console.log('success');
          callback(result);
        }
      }
    )
  })
}

export function getPastEvents(type, callback) {
  registryInstance.getPastEvents(type, {
    fromBlock: 1,
  }, function(error, result) {
    if (error) {
      console.log(error);
    } else {
      callback(result);
    }
  })
}

export function getListings(applications, callback) {
  Promise.all(applications.map(app => (
    registryInstance.methods.listings(app.returnValues.listingHash)
      .call()
  )))
    .then((values) => {
      callback(values);
    })
    .catch((error) => console.log(error));
}

export function challengesResolved(applications, callback) {
  Promise.all(applications.map((app) => registryInstance.methods.challenges(app.challengeID).call()))
    .then((values) => {
      callback(values.map((value) => value.resolved));
    })
    .catch((error) => {
      console.log(error);
    })

  // registryInstance.methods.challenges(challengeID).call()
  //   .then((challenge) => {
  //     callback(challenge.resolved);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   })
}

export function challengeResolved(id, callback) {
  registryInstance.methods.challenges(id).call()
    .then((result) => {
      callback(result.resolved);
    }).catch((error) => {
      console.log(error);
    });
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
          callback(0);
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
          callback(0);
        } else {
          callback(res);
        }
      })
  })
}

// event listeners

export const setRegistryEventListener = (event, callback) => {
  registryInstance.events.allEvents(null, function(error, result) {
    if (error) {
      console.log(error);
    } else {
      callback(result);
    }
  });
}

export const setPLCREventListener = (event, callback) => {
  plcrInstance.events.allEvents(null, function(error, result) {
    if (error) {
      console.log(error);
    } else {
      callback(result);
    }
  });
} */