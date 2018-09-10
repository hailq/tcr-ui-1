import Web3 from 'web3';

import config from '../config/config.json';
import registryContract from '../contracts/SingleRegistry.json'
import tokenContract from '../contracts/EIP20.json'
import votingContract from '../contracts/PLCRVoting.json';

import { createSalt } from '../utils';
import { soliditySha3, hexToAscii } from 'web3-utils';
import EthCrypto from '../eth-crypto';

export let web3;
if (typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}

const REGISTRY_ADDRESS = config.registryAddress;
const MIN_DEPOSIT = config.minDeposit;
const GAS_LIMIT = config.gasLimit;

export const registryInstance = web3.eth.contract(registryContract.abi).at(REGISTRY_ADDRESS);

export const getAccount = (callback) => {
  web3.eth.getAccounts((error, result) => {
    if (error) {
      console.log(error);
    } else {
      const acc = result[0];
      callback(acc);
    }
  })
}

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

/* 
Contract functions
*/

function approveTokensToRegistry(amount, callback) {
  getAccount((acc) => {
    const address = REGISTRY_ADDRESS;
    getTokenInstance((tokenInstance) => {
      tokenInstance.approve(address, amount,
        { from: acc },
        (error, result) => {
          if (error) {
            console.log(error);
          } else {
            callback(result);
          }
        }
      );
    })
  })
}

function approveTokensToVoting(amount, callback) {
  getAccount((acc) => {
    registryInstance.voting((error, address) => {
      getTokenInstance((tokenInstance) => {
        tokenInstance.approve(address, amount,
          { from: acc },
          (error, result) => {
            if (error) {
              console.log(error);
            } else {
              requestVotingRights(amount, callback);
            }
          }
        );
      })
    })
  })
}

function requestVotingRights(amount, callback) {
  getAccount((acc) => {
    getVotingInstance((votingInstance) => {
      votingInstance.requestVotingRights(amount,
        { from: acc, gas: GAS_LIMIT },
        (error, result) => {
          if (error) {
            console.log(error);
          } else {
            callback();
          }
        })
    })
  })
}

export function apply(listing, deposit, callback) {
  getAccount((acc) => {
    // approveTokensToRegistry(deposit, () => {
    //   const hashedListingName = web3.sha3(listing.listingName);
    //   registryInstance.apply(hashedListingName, deposit, JSON.stringify(listing), {
    //     from: acc, gas: GAS_LIMIT,
    //   }, callback);
    // })

    const hashedListingName = web3.sha3(listing.listingName);
    const hashedSubject = web3.sha3(listing.subject);
    registryInstance.apply(hashedListingName, hashedSubject, deposit, JSON.stringify(listing), {
      from: acc, gas: GAS_LIMIT,
    }, callback);
  })
}

export function challenge(listingHash, data, callback) {
  getAccount((acc) => {
    // approveTokensToRegistry(MIN_DEPOSIT, () => {
    //   registryInstance.challenge(listingHash, data,
    //     { from: acc, gas: GAS_LIMIT },
    //     callback
    //   )
    // })

    registryInstance.challenge(listingHash, data,
      { from: acc, gas: GAS_LIMIT },
      callback
    )
  })
}

export function challengeSubject(listingHash, subject, data, callback) {
  getAccount((acc) => {
    // approveTokensToRegistry(MIN_DEPOSIT, () => {
    //   registryInstance.challenge(listingHash, data,
    //     { from: acc, gas: GAS_LIMIT },
    //     callback
    //   )
    // })

    const hashedSubject = web3.sha3(subject);
    registryInstance.challengeSubject(listingHash, hashedSubject, data,
      { from: acc, gas: GAS_LIMIT },
      callback
    )
  })
}

export function commitVote(listingHash, challenge, tokens, vote, privateKey, callback) {
  getAccount((acc) => {
    getVotingInstance(async (votingInstance) => {
      // approveTokensToVoting(tokens, async () => {
      //   const salt = createSalt();
      //   const secretHash = soliditySha3({ type: 'uint', value: vote }, { type: 'uint', value: salt });

      //   //TODO: Get account public key
      //   const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey)

      //   //TODO: Encrypt voting info by public key
      //   const voteObject = {
      //     vote: vote,
      //     salt: salt
      //   }
      //   const secretMessage = JSON.stringify(voteObject)
      //   const encrypted = await EthCrypto.encryptWithPublicKey(
      //     publicKey,
      //     secretMessage
      //   )
      //   const encryptedString = EthCrypto.cipher.stringify(encrypted)

      //   //TODO: Include encrypted voting info to contract call

      //   votingInstance.getInsertPointForNumTokens(acc, tokens, challenge.challengeID, (error, prevPollID) => {
      //     votingInstance.commitVote(challenge.challengeID, secretHash, tokens, prevPollID, encryptedString,
      //       { from: acc, gas: GAS_LIMIT },
      //       (error, result) => {
      //         callback(error, {
      //           voteOption: vote,
      //           numTokens: tokens,
      //           commitEnd: challenge.commitEndDate.toLocaleString(),
      //           revealEnd: challenge.revealEndDate.toLocaleString(),
      //           listingID: listingHash,
      //           salt: salt,
      //           pollID: challenge.challengeID.toString(),
      //           secretHash: secretHash,
      //           account: acc
      //         });
      //       }
      //     )
      //   })
      // })

      const salt = createSalt();
      const secretHash = soliditySha3({ type: 'uint', value: vote }, { type: 'uint', value: salt });

      //TODO: Get account public key
      const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey)

      //TODO: Encrypt voting info by public key
      const voteObject = {
        vote: vote,
        salt: salt
      }
      const secretMessage = JSON.stringify(voteObject)
      const encrypted = await EthCrypto.encryptWithPublicKey(
        publicKey,
        secretMessage
      )
      const encryptedString = EthCrypto.cipher.stringify(encrypted)

      //TODO: Include encrypted voting info to contract call

      votingInstance.getInsertPointForNumTokens(acc, tokens, challenge.challengeID, (error, prevPollID) => {
        votingInstance.commitVote(challenge.challengeID, secretHash, tokens, prevPollID, encryptedString,
          { from: acc, gas: GAS_LIMIT },
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
  })
}

// export function revealVote(voteJSON, callback) {
//   getAccount((acc) => {
//     getVotingInstance((votingInstance) => {
//       votingInstance.revealVote(voteJSON.pollID, voteJSON.voteOption, voteJSON.salt,
//         { from: acc, gas: GAS_LIMIT },
//         callback
//       );
//     })
//   })
// }

export function revealVote(pollId, privateKey, callback) {
  getAccount((acc) => {
    getVotingInstance((votingInstance) => {

      votingInstance.getRevealInfo.call(pollId, (err, result) => {
        const message = hexToAscii(result.toString())

        // Decrypt message
        const encryptedObject = EthCrypto.cipher.parse(message)
        EthCrypto.decryptWithPrivateKey(
          privateKey,
          encryptedObject
        ).then((decrypted) => {
          console.log(decrypted);

          const decryptedPayload = JSON.parse(decrypted)

          votingInstance.revealVote(pollId, decryptedPayload.vote, decryptedPayload.salt,
            { from: acc, gas: GAS_LIMIT },
            callback
          );
        })
      })
    })
  })
}

export function getRevealInfo(pollId, callback) {
  getVotingInstance((votingInstance) => {
    votingInstance.getRevealInfo.call(pollId, callback)
  })
}

export function updateStatus(listingHash, callback) {
  getAccount((acc) => {
    registryInstance.updateStatus(listingHash,
      { from: acc, gas: GAS_LIMIT },
      callback
    );
  })
}

export function exit(listingHash, callback) {
  getAccount((acc) => {
    registryInstance.exit(listingHash,
      { from: acc, gas: GAS_LIMIT },
      callback
    );
  })
}

export function getPastEvents(type, callback) {
  registryInstance[type]({}, { fromBlock: 0 })
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
  registryInstance.challenges(id, (error, challenge) => {
    if (error) {
      console.log(error);
    } else {
      callback(challenge[2]);
    }
  });
}

export function checkSubjectStatus(listingHash, subject, callback) {
  const subjectHash = web3.sha3(subject);
  registryInstance.isSubjectWhitelisted.call(listingHash, subjectHash, (err, result) => {
    callback(result);
  });
}

//////////////////////////////////////////////////////////////////
//// User Info functions                                  ////////
//////////////////////////////////////////////////////////////////
export function getTotalEther(callback) {
  getAccount((acc) => {
    web3.eth.getBalance(acc, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        callback(web3.fromWei(result))
      }
    })
  })
}

export function getTotalToken(callback) {
  getAccount((acc) => {
    getTokenInstance((tokenInstance) => {
      tokenInstance.balanceOf(acc, (error, totalToken) => {
        if (error) {
          console.log(error);
        } else {
          callback(totalToken)
        }
      })
    })
  })
}

export function getAllowance(callback) {
  getAccount((acc) => {
    getTokenInstance((tokenInstance) => {
      tokenInstance.allowance(acc, REGISTRY_ADDRESS, (error, allowance) => {
        if (error) {
          console.log(error);
        } else {
          callback(allowance);
        }
      })
    })
  })
}