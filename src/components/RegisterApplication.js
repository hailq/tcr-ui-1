import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ethUtil from 'ethereumjs-util';
import {
  registryInstance,
  BLOCK_GAS_LIMIT,
  CLIENT_ADDRESS2,
  MIN_DEPOSIT
} from '../web3';
import { handleRegisterApplication } from '../actions/applications';

class ApproveTokens extends Component {
  state = {
    input: ''
  }

  handleChange = (e) => {
    this.setState({
      input: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const listingName = this.state.input;
    const hashedListingName = '0x' + ethUtil.sha3(listingName, 256).toString('hex');
    registryInstance.methods.apply(hashedListingName, MIN_DEPOSIT, listingName)
      .send({from: CLIENT_ADDRESS2, gas: BLOCK_GAS_LIMIT}, function(err, result) {
        if (err) console.log('ERR: ', err);
        else {
          console.log(result);
        }
      });

  }

  render() {
    return (
      <div>
        <h3>Register your application</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="applicationName">Application name: </label>
            <input 
              type="text"
              className="form-control"
              id="applicationName"
              onChange={this.handleChange}  
            />
          </div>
          <div>
            <button type="submit" className="btn btn-info">Submit Application</button>
          </div>
        </form>
        <Link to="/">Back to home page</Link>
      </div>
    );
  }
}

export default ApproveTokens;