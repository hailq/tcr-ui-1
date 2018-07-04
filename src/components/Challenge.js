import React, { Component } from 'react';
import { challenge } from '../web3';

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
    challenge(listingHash, this.state.reasoning, (result) => {
      console.log(result);
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

export default Challenge