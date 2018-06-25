import React, { Component } from 'react';

class Remove extends Component {
  render() {
    return (
      <div>
        <h4>Remove a listing</h4>
        <div>
          <label>Enter listing name:</label>
          <input type="text" />
        </div>
        <button className="btn btn-danger">Remove</button>
      </div>
    );
  }
}

export default Remove