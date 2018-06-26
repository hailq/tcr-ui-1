import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Listing extends Component {
  render() {
    const id = this.props.match.params.id;
    const listing = this.props[id];

    if (!listing) return (
      <div>
        {/* <div className="alert alert-danger">
          <strong>Error!</strong> Listing doesn't exist.
        </div> */}
      </div>
    )

    return (
      <div>
        <h3>{listing.data}</h3>
        <ul className="list-group">
          <li className="list-group-item"><b>Listing Hash:</b> {listing.listingHash}</li>
          <li className="list-group-item"><b>Applicant:</b> {listing.applicant}</li>
          <li className="list-group-item"><b>Deposit:</b> {listing.deposit}</li>
          <li className="list-group-item"><b>Application End Date: </b> {listing.appEndDate}</li>
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