import {
  getTotalEther,
  getTotalToken,
  getAllowance
} from '../web3'

export const SET_ETHER = "SET_ETHER";
export const SET_TOKEN = "SET_TOKEN";
export const SET_ALLOWANCE = "SET_ALLOWANCE";

export function setUserInfo() {
  return (dispatch) => {
    dispatch(setEther());
    dispatch(setToken());
    dispatch(setAllowance())
  }
}

function setEther(ether) {
  return {
    type: SET_ETHER,
    ether: getTotalEther().toString()
  }
}

function setToken(token) {
  return {
    type: SET_TOKEN,
    token: getTotalToken().toString()
  }
}

function setAllowance(allowance) {
  return {
    type: SET_ALLOWANCE,
    allowance: getAllowance().toString()
  }
}