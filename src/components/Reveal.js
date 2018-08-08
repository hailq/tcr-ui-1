import React, { Component } from 'react';
import { revealVote } from '../web3/web3';

import { FormGroup, Label, Input, Button, Alert } from 'reactstrap';

class Reveal extends Component {
  state = {
    successVisibility: false,
    errorVisibility: false,
    file: null,
    fileReader: null,
    privateKey: ""
  }

  componentDidMount() {
    // let fileReader = new FileReader();
    // fileReader.onload = (e) => {
    //   const vote = JSON.parse(e.target.result);
    //   revealVote(vote, (error, result) => {
    //     if (error) {
    //       console.log(error);
    //       this.setState({
    //         errorVisibility: true,
    //         successVisibility: false
    //       })
    //     } else {
    //       this.setState({
    //         errorVisibility: false,
    //         successVisibility: true
    //       })
    //     }
    //   });
    // }
    // this.setState({ fileReader })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // this.state.fileReader.readAsText(this.state.file);

    const challenge = this.props.challenge;
    console.log('pollId: ', challenge.challengeID.toString())
    console.log('private key: ', this.state.privateKey)

    revealVote(challenge.challengeID.toString(), this.state.privateKey, (error, result) => {
      if (error) {
        console.log(error);
        this.setState({
          errorVisibility: true,
          successVisibility: false
        })
      } else {
        this.setState({
          errorVisibility: false,
          successVisibility: true
        })
      }
    });
  }

  handleChange = (e) => {
    this.setState({ file: e.target.files[0] })
  }

  handleChangePrivateKey = (e) => {
    this.setState({ privateKey: e.target.value })
  }

  render() {
    return this.props.appState !== 'reveal' ?
      <div className="font-italic">
        There are no active vote revealing periods for this application.
      </div> :
      <div>
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <label><strong>Private key:</strong></label>
            <Input type="text" id="private-key" onChange={this.handleChangePrivateKey} />
          </FormGroup>
          <Button type="submit" color="info">Submit</Button>
        </form>
        <br />

        {/* Success/error notifications. */}
        {this.state.successVisibility &&
          <Alert color="success">
            <strong><ion-icon name="checkmark-circle"></ion-icon> Revealed vote successfully.</strong>
          </Alert>
        }
        {this.state.errorVisibility &&
          <Alert color="danger">
            <strong><ion-icon name="close-circle"></ion-icon> Error:</strong> Could not commit vote. Make sure the reveal period is still valid.
        </Alert>
        }
      </div>;
  }
}

export default Reveal;