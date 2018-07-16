import React, { Component } from 'react';
import { connect } from 'react-redux';
import { commitVote } from '../web3/web3';
import config from '../config/config';

import { Button, FormGroup, Alert, Label, Input } from 'reactstrap';

class Vote extends Component {
  state = {
    successVisibility: false,
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
    const tokens = parseInt(this.state.tokens, 10) * config.scale;

    commitVote(listingHash, challenge, tokens, this.state.checked, (error, voteJSON) => {
      if (error) {
        console.log(error);
        this.setState({errorVisibility: true});
      } else {
        console.log("Commit vote success.");
        console.log(voteJSON);
        this.setState({
          voteJSON,
          successVisibility: true
        });
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
          <Label><strong>Options</strong></Label>
          <FormGroup check>
            <Label check>
              <Input type="radio" name="vote" value="1" onClick={this.handleClick}/>
              Approve
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type="radio" name="vote" value="2" onClick={this.handleClick}/>
              Reject
            </Label>
          </FormGroup>
          <br />

          <FormGroup>
            <label><strong>Number of tokens:</strong></label>
            <Input type="text" id="tokens" onChange={this.handleChangeTokens} />
          </FormGroup>
          <Button
            color="info"
            type="submit"
            onClick={this.handleSubmit}
            disabled={this.state.checked === ''}
          >Submit Vote</Button>
        </form>

        {/* Link to download vote json file */}
        {this.state.voteJSON &&
        <a href="#" onClick={() => this.download('vote.json', JSON.stringify(this.state.voteJSON))}>
          Download vote JSON.
        </a>
        }

        <br />
        {/* Success/error notifications. */}
        {this.state.successVisibility &&
        <Alert color="success">
          <strong>Voted success.</strong>
        </Alert>
        }
        {this.state.errorVisibility &&
        <Alert color="danger">
          <strong>Error:</strong> Could not commit vote. Make sure your account has sufficient balance and the voting period is still valid.
        </Alert>
        }
      </div>
    );
  }
}

function mapStateToProps({ applications, challenges }) {
  return { applications, challenges };
}

export default connect(mapStateToProps)(Vote);