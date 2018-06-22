import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { handleRegisterApplication } from '../actions/applications';

class ApproveTokens extends Component {
  state = {
    input: ''
  }

  handleChange = (e) => {
    this.setState({
      input: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const listingName = this.state.input;
    this.props.dispatch(handleRegisterApplication(listingName))

  }

  render() {
    return (
      <div>
        <h3>Register your application</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="applicationName">Application name: </label>
            <input 
              type="text"
              className="form-control"
              id="applicationName"
              onChange={this.handleChange}  
            />
          </div>
          <div>
            <button type="submit" className="btn btn-info">Submit Application</button>
          </div>
        </form>
        <Link to="/">Back to home page</Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    applications: state
  }
}

export default connect(mapStateToProps)(ApproveTokens);