import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUserInfo } from '../actions/account';

import {
  approve
} from '../web3';

class ApproveToken extends Component {
  state = {
    registry: '',
    plcr: ''
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const target = e.target.name;
    const state = this.state;
    const props = this.props;

    // convert input to integer
    // TODO: check if input is a valid number
    let amount = parseInt(state[target], 10);

    // call approve method
    approve(e.target.name, amount, () => {
      console.log('Added ' + amount);
      this.props.dispatch(setUserInfo());
      props.history.push('/')
    })
  }

  render() {
    return (
      <div>
        <h3>Approve your tokens to the registry</h3>
        <form name="registry" onSubmit={this.handleSubmit}>
          <label htmlFor="tokenAmount">Enter number of tokens</label>
          <input name="registry" type="text" id="tokenAmount" onChange={this.handleChange}/>
          <button
            id="registry"
            type="submit"
            className="btn btn-info"
            disabled={!this.state.registry ? "disabled" : ""}
          >Submit
          </button>
        </form>
        <br />
        <h3>Approve your tokens to the PLCR contract</h3>
        <form name="plcr" onSubmit={this.handleSubmit}>
          <label htmlFor="tokenAmount">Enter number of tokens</label>
          <input name="plcr" type="text" id="tokenAmount" onChange={this.handleChange}/>
          <button
            name="plcr"
            type="submit"
            className="btn btn-info"
            disabled={!this.state.plcr.length ? "disabled" : ""}
          >Submit
          </button>
        </form>
      </div>
    );
  }
}

export default connect(null)(ApproveToken);