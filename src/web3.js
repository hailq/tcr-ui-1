import Web3 from 'web3';

import * as registryContract from './Registry.json'
import * as tokenContract from './EIP20.json'
import * as votingContract from './PLCRVoting.json';

import { createSalt } from './utils';
import { soliditySha3 } from 'web3-utils';

// export const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
let web3;
if (typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}

const REGISTRY_ADDRESS = '0x1ff158f2016fc24f190de18923c1fb170028c500';

export const registryInstance = web3.eth.contract(registryContract.abi).at(REGISTRY_ADDRESS);

const getTokenInstance = (callback) => {
  registryInstance.token((error, result) => {
    if (error) {
      console.log(error);
    } else {
      callback(web3.eth.contract(tokenContract.abi).at(result));
    }
  });
}

const getVotingInstance = (callback) => {
  registryInstance.voting((error, result) => {
    if (error) {
      console.log(error);
    } else {
      callback(web3.eth.contract(votingContract.abi).at(result));
    }
  });
}

const acc = web3.eth.accounts[0];
const MIN_DEPOSIT = 10000000000000000000;
const BLOCK_GAS_LIMIT = 4500000; //6721975;

/* 
Contract functions
*/

export function approve(target, amount, callback) {
  const address = target === "registry" ? REGISTRY_ADDRESS : registryInstance.voting();
  getTokenInstance((tokenInstance) => {
    tokenInstance.approve(address, amount,
      {from: acc},
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          if (target === 'plcr') {
            getVotingInstance((votingInstance) => {
              votingInstance.requestVotingRights(amount, 
                {from: acc, gas: BLOCK_GAS_LIMIT},
                (error, result) => {
                  if (error) {
                    console.log(error);
                  } else {
                    callback();
                  }
                })
            })
          } else {
            callback(result);
          }
        }
      }
    );
  })
}

export function apply(listing, callback) {
  approve('registry', MIN_DEPOSIT, () => {
    const hashedListingName = web3.sha3(listing.listingName);
    registryInstance.apply(hashedListingName, MIN_DEPOSIT, JSON.stringify(listing), {
      from: acc, gas: BLOCK_GAS_LIMIT, 
    }, callback);
  })
}

export function challenge(listingHash, data, callback) {
  approve('registry', MIN_DEPOSIT, () => {
    registryInstance.challenge(listingHash, data, 
      {from: acc, gas: BLOCK_GAS_LIMIT},
      callback
    )
  })
}

export function commitVote(listingHash, challenge, tokens, vote, callback) {
  getVotingInstance((votingInstance) => {
    approve('plcr', tokens, () => {
      console.log('here');
      const salt = createSalt();
      const secretHash = soliditySha3({type: 'uint', value: vote}, {type: 'uint', value: salt});
  
      let prevPollID = votingInstance.getInsertPointForNumTokens(acc, tokens, challenge.challengeID)
  
      votingInstance.commitVote(challenge.challengeID, secretHash, tokens, prevPollID,
        {from: acc, gas: BLOCK_GAS_LIMIT},
        (error, result) => {
          callback(error, {
            voteOption: vote,
            numTokens: tokens,
            commitEnd: challenge.commitEndDate.toLocaleString(),
            revealEnd: challenge.revealEndDate.toLocaleString(),
            listingID: listingHash,
            salt: salt,
            pollID: challenge.challengeID.toString(),
            secretHash: secretHash,
            account: acc
          });
        }
      )
    })
  })
}

export function revealVote(voteJSON) {
  getVotingInstance((votingInstance) => {
    votingInstance.revealVote(voteJSON.pollID, voteJSON.voteOption, voteJSON.salt,
      {from: acc, gas: BLOCK_GAS_LIMIT},
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          console.log(result);
        }
      }
    );
  })
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
  registryInstance[type]({}, {fromBlock: 0})
    .get((error, result) => {
      if (error) {
        console.log(error);
      } else {
        callback(result);
      }
    })
}

export function getListings(applications, callback) {
  Promise.all(applications.map(app => registryInstance.listings(app.args.listingHash)))
    .then((listings) => {
      const results = listings.map((listing) => ({
        applicationExpiry: listing[0].toString(),
        whitelisted: listing[1],
        owner: listing[2],
        unstakedDeposit: listing[3].toString(),
        challengeID: listing[4].toString()
      }))

      callback(results);
    })
    .catch((error) => console.log(error));
}

export function getListing(application, callback) {
  registryInstance.listings(application.args.listingHash, (error, listing) => {
    if (error) {
      console.log(error);
    } else {
      callback({
        applicationExpiry: listing[0].toString(),
        whitelisted: listing[1],
        owner: listing[2],
        unstakedDeposit: listing[3].toString(),
        challengeID: listing[4].toString()
      })
    }
  });
}

export function challengeResolved(id, callback) {
  return registryInstance.challenges(id)[2];
}

//////////////////////////////////////////////////////////////////
//// User Info functions                                  ////////
//////////////////////////////////////////////////////////////////
export function getTotalEther(callback) {
  web3.eth.getBalance(acc, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      callback(web3.fromWei(result))
    }
  })
}

export function getTotalToken(callback) {
  getTokenInstance((tokenInstance) => {
    tokenInstance.balanceOf(acc, (error, totalToken) => {
      if (error) {
        console.log(error);
      } else {
        callback(totalToken)
      }
    })
  })
}

export function getAllowance(callback) {
  getTokenInstance((tokenInstance) => {
    tokenInstance.allowance(acc, REGISTRY_ADDRESS, (error, allowance) => {
      if (error) {
        console.log(error);
      } else {
        callback(allowance);
      }
    })
  })
}

/* 
Event listeners
*/

export const setRegistryEventListener = () => {
  let listener = web3.eth.filter({REGISTRY_ADDRESS});
  listener.watch((error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.log(result);
    }
  });
}