import React, { Component } from 'react';

import {
  tokenInstance,
  registryAddress,
  CLIENT_ADDRESS2,
  BLOCK_GAS_LIMIT,
} from '../web3';

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
    const state = this.state;
    const props = this.props;

    // convert input to integer
    // TODO: check if input is a valid number
    let amount = parseInt(state.input, 10);

    // call approve method
    tokenInstance.methods.approve(registryAddress, amount)
      .send({from: CLIENT_ADDRESS2, gas: BLOCK_GAS_LIMIT}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log('Added ' + state.input);
          props.history.push('/register-application')
        }
      })
  }

  render() {
    return (
      <div>
        <h3>Approve your tokens to the registry</h3>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="tokenAmount">Enter amount of tokens</label>
          <input type="text" id="tokenAmount" onChange={this.handleChange}/>
          <button
            type="submit"
            className="btn btn-info"
            disabled={!this.state.input.length ? "disabled" : ""}
          >Submit
          </button>
        </form>
      </div>
    );
  }
}

export default ApproveTokens;