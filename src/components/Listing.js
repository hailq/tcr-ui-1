import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Listing extends Component {
  render() {
    const id = this.props.match.params.id;
    const listing = this.props[id];

    if (!listing) return (
      <div>
        <div className="alert alert-danger">
          <strong>Error!</strong> Listing doesn't exist.
        </div>
        <Link to='/'>Go back to home page.</Link>
      </div>
    )

    return (
      <div>
        <h3>Listing {id}</h3>
        <ul className="list-group">
          <li className="list-group-item"><label>Registry:</label> {listing.registry}</li>
          <li className="list-group-item"><label>Credential:</label> {listing.credential}</li>
          <li className="list-group-item"><label>Deposit:</label> {listing.deposit}</li>
          <li className="list-group-item"><label>Meta Data: </label> {listing.metadata}</li>
        </ul>
        <Link to={`/applications/${id}/vote`}>Vote</Link>
        <br />
        <Link to={`/applications/${id}/challenge`}>Challenge</Link>
      </div>
    )
  }
}

function mapStateToProps({ applications }) {
  return applications;
}

export default connect(mapStateToProps)(Listing);