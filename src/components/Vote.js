import React, { Component } from 'react';
import { connect } from 'react-redux';
import { commitVote } from '../web3';

class Vote extends Component {
  state = {
    errorVisibility: false,
    checked: '',
    tokens: "",
    voteJSON: null
  }

  handleClick = (e) => {
    this.setState({ checked: e.target.value });
  }

  handleChangeTokens = (e) => {
    this.setState({ tokens: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    
    const listingHash = this.props.match.params.id;
    const challengeID = parseInt(this.props.applications[listingHash].challengeID, 10);
    const challenge = this.props.challenges[challengeID];
    const tokens = parseInt(this.state.tokens, 10);

    commitVote(listingHash, challenge, tokens, this.state.checked, (error, voteJSON) => {
      if (error) {
        console.log(error);
        this.setState({errorVisibility: true});
      } else {
        console.log("Commit vote success.");
        console.log(voteJSON);
        this.setState({voteJSON});
      }
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
    const id = this.props.match.params.id;
    let name = this.props.applications[id] ? this.props.applications[id].data.listingName : "";

    return (
      <div>
        <div className="title">
          <h3>Vote for {name}</h3>
        </div>

        <form>
          <div className="form-group">
            <label><strong>Options:</strong></label>
            <br />
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
          </div>

          <div className="form-group">
            <label><strong>Number of tokens:</strong></label>
            <br />
            <input type="text" id="tokens" onChange={this.handleChangeTokens} />
          </div>
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
        {this.state.errorVisibility &&
        <div className="alert alert-danger">
          <strong>Error:</strong> Could not commit vote. Make sure your account has sufficient balance and the voting period is still valid.
        </div>
        }
      </div>
    );
  }
}

function mapStateToProps({ applications, challenges }) {
  return { applications, challenges };
}

export default connect(mapStateToProps)(Vote);