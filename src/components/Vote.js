import React, { Component } from 'react';

class Vote extends Component {
  render() {
    const id = this.props.match.params.id;

    return (
      <div>
        <h4>Vote for {id}</h4>
        <form>
          <input name="vote" type="radio" value="approve" /> Approve <br />
          <input name="vote" type="radio" value="reject" /> Reject <br />
          <button className="btn btn-info" type="submit">Submit Vote</button>
        </form>
      </div>
    );
  }
}

export default Vote