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
    console.log('random');
    dispatch(handleSetEther());
    dispatch(handleSetToken());
    dispatch(handleSetAllowance())
  }
}

function handleSetEther() {
  return (dispatch) => {
    getTotalEther((ether) => {
      dispatch(setEther(ether));
    })
  }
}

function handleSetToken() {
  return (dispatch) => {
    getTotalToken((token) => {
      dispatch(setToken(token));
    })
  }
}

function handleSetAllowance() {
  return (dispatch) => {
    getAllowance((allowance) => {
      dispatch(setAllowance(allowance));
    })
  }
}

function setEther(ether) {
  return {
    type: SET_ETHER,
    ether
  }
}

function setToken(token) {
  return {
    type: SET_TOKEN,
    token
  }
}

function setAllowance(allowance) {
  return {
    type: SET_ALLOWANCE,
    allowance
  }
}