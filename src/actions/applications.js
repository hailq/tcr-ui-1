import {
  registryInstance,
  BLOCK_GAS_LIMIT,
  CLIENT_ADDRESS2,
  MIN_DEPOSIT
} from '../web3';
import ethUtil from 'ethereumjs-util';

export const REGISTER_APPLICATION = 'REGISTER_APPLICATION';

export function handleRegisterApplication(applicationName) {
  return (dispatch) => {
    const hashedListingName = '0x' + ethUtil.sha3(applicationName, 256).toString('hex');
    registryInstance.methods.apply(hashedListingName, MIN_DEPOSIT, applicationName)
      .send({from: CLIENT_ADDRESS2, gas: BLOCK_GAS_LIMIT}, function(err, result) {
        if (err) console.log('ERR: ', err);
        else {
          console.log(result);
          dispatch(registerApplication);
        }
      });
  }
}

function registerApplication(applicationName) {
  return {
    type: REGISTER_APPLICATION,
    applicationName
  }
}