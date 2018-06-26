import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getWhitelistedApplications } from '../web3'

class Listings extends Component {
  state = {
    registry: [],
    applications: [],
    voting: [],
    currentTab: "registry"
  }

  componentDidMount() {
    // // get all listings currently in registry.
    // getWhitelistedApplications((apps) => {
    //   const whitelistedApps = apps.map((app) => {
    //     return this.props.applications[app];
    //   })
    //   this.setState({registry: whitelistedApps});
    // });
    // //getRemovedApplications(); // dispatch action to remove application from registry
    // console.log(this.props);
    // this.setState({applications: Object.values(this.props.applications)});
  }

  handleTabChange = (e) => {
    this.setState({
      currentTab: e.target.id
    });
  }

  render() {
    const listings = this.state[this.state.currentTab];

    return (
      <div>
        <h3>All Listings</h3>

        <div className="btn-group" role="group">
          <button
            id="registry"
            type="button"
            className="btn btn-dark"
            onClick={this.handleTabChange}
            disabled={this.state.currentTab === "registry"}
          >Registry</button>
          <button
            id="applications"
            type="button"
            className="btn btn-dark"
            onClick={this.handleTabChange}
            disabled={this.state.currentTab === "applications"}
          >Applications</button>
          <button
            id="voting"
            type="button"
            className="btn btn-dark"
            onClick={this.handleTabChange}
            disabled={this.state.currentTab === "voting"}
          >Voting</button>
        </div>

        {
        this.props.applications.length > 0
        ? <ul className="list-group">
            {this.props.applications.map((application) => {
              const listingHash = application.listingHash;
              return (
                <li key={listingHash} className="list-group-item">
                  <Link to={`/applications/${listingHash}`}>{application.data}</Link>
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
  // return { applications };
}

export default connect(mapStateToProps)(Listings)