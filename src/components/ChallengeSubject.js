import React, { Component } from 'react';
import { challengeSubject } from '../web3/web3';

import { FormGroup, Label, Input, Alert, Button } from 'reactstrap';

import config from '../config/config';

class ChallengeSubject extends Component {
  state = {
    subject: 'Algebra',
    reasoning: '',
    successVisibility: false,
    errorVisibility: false,
  };

  handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const listingHash = this.props.listingHash;

    challengeSubject(listingHash, this.state.subject, this.state.reasoning, (error, result) => {
      if (error) {
        console.log(error);
        this.setState({ errorVisibility: true });
      } else {
        console.log(result);
        console.log("Challenge success.");
        this.setState({ successVisibility: true })
      }
    });
  }

  render() {
    return this.props.appState !== 'challenge'
      ?
      (<div className="font-italic">
        There is already an active challenge for this application.
      </div>)
      :
      (<div>
        <div>
          <label>Challenge stake:</label> {config.minDeposit / config.scale} Tokens
        </div>

        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label>Subject:</Label>
            <Input
              value={this.state.subject}
              name="subject"
              type="textarea"
              onChange={this.handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Reasoning:</Label>
            <Input
              value={this.state.reasoning}
              name="reasoning"
              type="textarea"
              onChange={this.handleChange}
            />
          </FormGroup>

          <Button color="info" onClick={this.handleSubmit}>Submit Challenge</Button>
        </form>

        <br />
        {/* Success/error notifications. */}
        {this.state.successVisibility &&
          <Alert color="success">
            <strong>Challenged successfully.</strong>
          </Alert>
        }
        {this.state.errorVisibility &&
          <Alert color="danger">
            <strong><ion-icon name="close-circle"></ion-icon> Error:</strong> Could not challenge this application.
        </Alert>
        }
      </div>);
  }
}

export default ChallengeSubject;