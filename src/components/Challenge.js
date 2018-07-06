import { connect } from 'react-redux';

import React, { Component } from 'react';
import { challenge } from '../web3';
import { handleGetAllData } from '../actions';

class Challenge extends Component {
  state = {
    reasoning: '',
  };

  handleChange(e) {
    this.setState({ reasoning: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const listingHash = this.props.match.params.id;
    challenge(listingHash, this.state.reasoning, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
        console.log("Challenge success.");
      }
    });
  }

  render() {
    const id = this.props.match.params.id;

    return (
      <div>
        <h4>Challenge {id}</h4>
        <div>
          <label>Stake:</label> 1000 Tokens
        </div>
        <div>
          <label>Reasoning:</label><br />
          <textarea></textarea>
        </div>
        <button className="btn btn-info" onClick={this.handleSubmit}> Submit Challenge</button>
      </div>
    );
  }
}

export default connect(null)(Challenge);