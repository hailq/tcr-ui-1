import React, { Component } from 'react';
import { connect } from 'react-redux';
import { commitVote } from '../web3';

class Vote extends Component {
  state = {
    challenge: {},
    checked: '',
    tokens: 10000000000000000000,
    voteJSON: null
  }

  handleClick = (e) => {
    this.setState({ checked: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // get all challenge events that have the listinghash.
    // the current challenge will be the one with the latest time.
    // const voteOption = parseInt(this.state.checked, 10);
    
    const listingHash = this.props.match.params.id;
    const challengeID = parseInt(this.props.applications[listingHash].challengeID, 10);
    const challenge = this.props.challenges[challengeID];

    commitVote(listingHash, challengeID, challenge, this.state.checked, (voteJSON) => {
      this.setState({ voteJSON });
    })
  }

  // https://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
  download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

  render() {
    console.log(this.state.voteJSON);
    const id = this.props.match.params.id;

    return (
      <div>
        <h4>Vote for {id}</h4>
        <form>
          <input
            name="vote"
            type="radio"
            value="1"
            onClick={this.handleClick}
          /> Approve <br />
          <input
            name="vote"
            type="radio"
            value="0"
            onClick={this.handleClick}
          /> Reject <br />
          <button
            className="btn btn-info"
            type="submit"
            onClick={this.handleSubmit}
            disabled={this.state.checked === ''}
          >Submit Vote</button>
        </form>
        {this.state.voteJSON &&
        <a href="#" onClick={() => this.download('vote.json', JSON.stringify(this.state.voteJSON))}>
          Download vote JSON.
        </a>
        }
      </div>
    );
  }
}

function mapStateToProps({ applications, challenges }) {
  return { applications, challenges };
}

export default connect(mapStateToProps)(Vote);