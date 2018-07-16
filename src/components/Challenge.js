import { connect } from 'react-redux';

import React, { Component } from 'react';
import { challenge } from '../web3/web3';

import { FormGroup, Label, Input, Alert, Button } from 'reactstrap';

import config from '../config/config';

class Challenge extends Component {
  state = {
    reasoning: '',
    successVisibility: false,
    errorVisibility: false,
  };

  handleChange = (e) => {
    this.setState({ reasoning: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const listingHash = this.props.match.params.id;
    challenge(listingHash, this.state.reasoning, (error, result) => {
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
    const app = this.props.applications[this.props.match.params.id];
    const listingName = app ? app.data.listingName : "";

    return (
      <div>
        <div className="title">
          <h3>Challenge {listingName}</h3>
        </div>

        <div>
          <label>Stake:</label> {config.minDeposit / config.scale} Tokens
        </div>

        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label>Reasoning:</Label>
            <Input
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
          <strong>Error:</strong> Could not create application. Make sure your account has sufficient ballance and the listing name is not in the registry.
        </Alert>
        }
      </div>
    );
  }
}

function mapStateToProps({ applications }) {
  return { applications };
}

export default connect(mapStateToProps)(Challenge);