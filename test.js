import Web3 from 'web3'
import ethUtil from 'ethereumjs-util';

import * as registryContract from './Registry.json'
import * as tokenContract from './EIP20.json'
import * as plcrContract from './PLCRVoting.json';

export const web3 = new Web3("http://localhost:8545");

const registryAddress = ""
const tokenAddress = ""
const votingAddress = ""