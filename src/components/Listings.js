import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { challengesResolved } from '../web3'

class Listings extends Component {
  state = {
    registry: [],
    applications: [],
    voting: [],
    currentTab: "registry"
  }

  componentDidUpdate(prevProps) {
    const registry = [];
    const applications = [];
    const voting = [];

    const allApps = this.props.applications;
    
    challengesResolved(allApps, (challengeResolvedArray) => {
      for (let i = 0; i < allApps.length; i++) {
        if (this.props.applications[i].whitelisted) {
          registry.push(allApps[i]);
        } else {
          if (challengeResolvedArray[i]) applications.push(allApps[i]);
          else voting.push(allApps[i]);
        }
      }
      if (prevProps !== this.props) {
        this.setState({ registry, applications, voting });
      }
    })

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
        listings.length > 0
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
        : <div>No listings in this categories.</div>
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