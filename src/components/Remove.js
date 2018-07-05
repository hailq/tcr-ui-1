import React, { Component } from 'react';
import {connect} from 'react-redux';

import { exit } from '../web3';
import { handleGetInitialApplications } from '../actions/applications';

class Remove extends Component {
  state = {
    name: ''
  }

  handleSubmit = (e) => {
    const app = this.props.applications.filter((app) => 
      (app.data === this.state.name)
    )

    if (app.length === 0) {
      alert('no listing with that name');
    } else {
      const listingHash = app[0].listingHash;
      exit(listingHash, (result) => {
        this.props.dispatch(handleGetInitialApplications);
        console.log("Remove application success.");
        this.props.history.push('/');
      });
    }
  }

  handleChange = (e) => {
    this.setState({name: e.target.value});
  }

  render() {
    return (
      <div>
        <h4>Remove a listing</h4>
        <div>
          <label>Enter listing name:</label>
          <input type="text" onChange={this.handleChange} />
        </div>
        <button className="btn btn-danger" onClick={this.handleSubmit}>Remove</button>
      </div>
    );
  }
}

function mapStateToProps({ applications }) {
  return { 
    applications: Object.keys(applications).map((key) => applications[key])
  };
}

export default connect(mapStateToProps)(Remove);