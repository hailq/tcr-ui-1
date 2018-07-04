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

  componentDidUpdate(prevProps, prevState) {
    const registry = [];
    const applications = [];
    const voting = [];

    const allApps = this.props.applications;
    const allChallenges = this.props.challenges;
    // map challengeID to the challenges in props. if the revealenddate isn't over, then it's in voting.
    // if challengeID is 0 then it's an application.
    // else it's in registry.
    const currTime = Date.now() / 1000;

    allApps.forEach((app) => {
      // console.log(app);
      if (app.challengeID === "0") {
        applications.push(app);
      } else {
        if (parseInt(allChallenges[app.challengeID].revealEndDate, 10) > Date.now() / 1000) {
          // revealEndDate isn't over so it's being voted.
          voting.push(app);
        } else {
          if (app.whitelisted) {
            registry.push(app);
          } else {
            voting.push(app);
          }
        }
      }
    })

    if (prevProps !== this.props) {
      this.setState({ registry, applications, voting });
    }
    
    // challengesResolved(allApps, (challengeResolvedArray) => {
    //   for (let i = 0; i < allApps.length; i++) {
    //     if (!challengeResolvedArray[i]) {
    //       voting.push(allApps[i]);
    //     } else {
    //       if (this.props.applications[i].whitelisted) {
    //         registry.push(allApps[i]);
    //       } else {
    //         applications.push(allApps[i]);
    //       }
    //     }
    //   }
    //   if (prevProps !== this.props) {
    //     this.setState({ registry, applications, voting });
    //   }
    // })

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
          >Registry ({this.state.registry.length})</button>
          <button
            id="applications"
            type="button"
            className="btn btn-dark"
            onClick={this.handleTabChange}
            disabled={this.state.currentTab === "applications"}
          >Applications ({this.state.applications.length})</button>
          <button
            id="voting"
            type="button"
            className="btn btn-dark"
            onClick={this.handleTabChange}
            disabled={this.state.currentTab === "voting"}
          >Voting ({this.state.voting.length})</button>
        </div>

        {
        listings.length > 0
        ? <ul className="list-group">
            {listings.map((application) => {
              const listingHash = application.listingHash;
              return (
                <li key={listingHash} className="list-group-item">
                  <Link to={`/applications/${listingHash}`}>{application.data}</Link>
                </li>
              )
            })}
        </ul>
        : <div></div>
        }
      </div>
    )
  }
}

function mapStateToProps({ applications, challenges }) {
  return {
    applications: Object.keys(applications).map((application) => {
      return applications[application];
    }),
    challenges
  }
  // return { applications };
}

export default connect(mapStateToProps)(Listings)