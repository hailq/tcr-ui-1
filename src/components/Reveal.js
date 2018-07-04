import React, { Component } from 'react';
import { revealVote } from '../web3';

class Reveal extends Component {
  state = {
    file: null,
    fileReader: null,
    // fileReader: new FileReader()
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
        <h3>Reveal</h3>
        <form onSubmit={this.handleSubmit}>
          <label>
            Upload vote result file: <br />
            <input type="file" onChange={this.handleChange}/>
          </label>
          <br />
          <button type="submit" className="btn btn-info">Submit</button>
        </form>
      </div>
    )
  }
}

export default Reveal