import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUserInfo } from '../actions/account';

import {
  approveTokenToRegistry
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
    approveTokenToRegistry(amount, () => {
      console.log('Added ' + amount);
      this.props.dispatch(setUserInfo());
      props.history.push('/')
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

export default connect(null)(ApproveTokens);