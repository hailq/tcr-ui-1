import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Applications extends Component {
  render() {
    return (
      <div>
        <h3>All Applications</h3>

        <div className="btn-group" role="group">
          <button type="button" className="btn btn-dark" disabled="disabled">Registry</button>
          <button type="button" className="btn btn-dark">Applications</button>
          <button type="button" className="btn btn-dark">Voting</button>
        </div>

        {
        this.props.applications.length > 0
        ? <ul className="list-group">
            {this.props.applications.map((application) => {
              const username = application.username;
              return (
                <li key={username} className="list-group-item">
                  <Link to={`/applications/${username}`}>{username}</Link>
                </li>
              )
            })}
        </ul>
        : <div>There are no applications.</div>
        }
      </div>
    )
  }
}

function mapStateToProps({ applications }) {
  return {
    applications: Object.keys(applications).map((application) => {
      return applications[application];
    })
  }
}

export default connect(mapStateToProps)(Applications)