import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Applications extends Component {
  render() {
    return (
      <div>
        <h3>All Applications</h3>
        {
        this.props.applications.length > 0
        ? <ul>
            {this.props.applications.map((application) => {
              return (
                <li key={application.name}>
                  {application.name}
                </li>
              )
            })}
        </ul>
        : <div>There are no applications.</div>
        }
        <Link to="/">Back to home page</Link>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    applications: Object.keys(state).map((application) => {
      return state[application]
    })
  }
}

export default connect(mapStateToProps)(Applications)