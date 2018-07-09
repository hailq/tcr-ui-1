import React, { Component } from 'react';
import {connect} from 'react-redux';

import { exit } from '../web3';
import { handleGetInitialApplications } from '../actions/applications';

class Remove extends Component {
  state = {
    errorVisibility: false,
    name: ''
  }

  handleSubmit = (e) => {
    const app = this.props.applications.filter((app) => 
      (app.data.listingName === this.state.name)
    )

    if (app.length === 0) {
      this.setState({errorVisibility: true});
    } else {
      const listingHash = app[0].listingHash;
      exit(listingHash, (error, result) => {
        if (error) {
          console.log(error);
          this.setState({errorVisibility: true});
        } else {
          console.log("Remove application success.");
          this.props.history.push('/');
        }
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
        <button className="btn btn-danger" onClick={this.handleSubmit} disabled={this.state.name === ''}
        >Remove</button>
        <br />
        {this.state.errorVisibility &&
        <div className="alert alert-danger">
          <strong>Error:</strong> Could not remove application. Make sure you are the owner of the listing and the listing name is correct.
        </div>
        }
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