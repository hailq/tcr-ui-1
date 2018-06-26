import React, { Component } from 'react';
import { connect } from 'react-redux';
import { handleRegisterApplication } from '../actions/applications';

class Apply extends Component {
  state = {
    listingName: '',
  }

  handleChange = (e) => {
    const id = e.target.id;
    this.setState({
      [id]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const listing = this.state;
    this.props.dispatch(handleRegisterApplication(listing))

  }

  render() {
    return (
      <div>
        <h3>Register Listing</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Listing Name: </label>
            <input
              type="text"
              className="form-control"
              id="listingName"
              onChange={this.handleChange}  
            />
          </div>
          <div>
            <button type="submit" className="btn btn-info">Submit Application</button>
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    applications: state
  }
}

export default connect(mapStateToProps)(Apply);