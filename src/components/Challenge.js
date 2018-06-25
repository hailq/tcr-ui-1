import React, { Component } from 'react';

class Challenge extends Component {
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
        <button className="btn btn-info"> Submit Challenge</button>
      </div>
    );
  }
}

export default Challenge