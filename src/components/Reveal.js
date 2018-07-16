import React, { Component } from 'react';
import { revealVote } from '../web3';

import { FormGroup, Label, Input, Button, Alert } from 'reactstrap';

class Reveal extends Component {
  state = {
    errorVisibility: false,
    file: null,
    fileReader: null,
  }

  componentDidMount() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      const vote = JSON.parse(e.target.result);
      revealVote(vote);
    }
    this.setState({ fileReader })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.state.fileReader.readAsText(this.state.file);
  }

  handleChange = (e) => {
    this.setState({file: e.target.files[0]})
  }

  render() {
    return (
      <div>
        <div className="title">
          <h3>Reveal</h3>
        </div>
        
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label>Upload vote result file:</Label>
            <Input
              type="file"
              onChange={this.handleChange}
            />
          </FormGroup>
          <Button type="submit" color="info" disabled={!this.state.file}>Submit</Button>
        </form>
        {this.state.errorVisibility &&
        <Alert color="danger">
          <strong>Error:</strong> Could not commit vote. Make sure the reveal period is still valid.
        </Alert>
        }
      </div>
    )
  }
}

export default Reveal