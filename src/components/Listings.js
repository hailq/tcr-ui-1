import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import App from './App';
// import ListingTable from './Listings';

import { Button, Collapse } from 'reactstrap';

class Listings extends Component {
  state = {
    registry: [],
    applications: [],
    voting: [],
    currentTab: "registry"
  }

  componentDidMount() {
    this.updateState();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) this.updateState();
  }

  updateState = () => {
    const registry = [];
    const applications = [];
    const voting = [];

    const allApps = this.props.applications;
    const allChallenges = this.props.challenges;

    allApps.forEach((app) => {
      if (app.challengeID === "0") {
        applications.push(app);
      } else {
        // console.log(app);
        // console.log(allChallenges);
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
    
    this.setState({ registry, applications, voting });
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
        <div className="title">
          <h3>All Listings</h3>
        </div>

        <Button className="tab" color="info" size="sm" block caret>Registry ({this.state.registry.length})</Button>
        <Collapse isOpen={this.state.currentTab === 'registry'}>
          {/* <ListingTable listings={this.state.registry} /> */}
        </Collapse>
        <Button className="tab" color="info" size="sm" block>Applications ({this.state.applications.length})</Button>
        <Collapse isOpen={this.state.currentTab === 'applications'}>
          {/* <ListingTable listings={this.state.applications} /> */}
        </Collapse>
        <Button className="tab" color="info" size="sm" block>Voting ({this.state.voting.length})</Button>
        <Collapse isOpen={this.state.currentTab === 'voting'}>
          {/* <ListingTable listings={this.state.voting} /> */}
        </Collapse>


        <br />
        <div className="btn-group" role="group">
          <button
            id="registry"
            type="button"
            className="btn btn-info tab"
            onClick={this.handleTabChange}
            disabled={this.state.currentTab === "registry"}
          >Registry ({this.state.registry.length})</button>
          <button
            id="applications"
            type="button"
            className="btn btn-info tab"
            onClick={this.handleTabChange}
            disabled={this.state.currentTab === "applications"}
          >Applications ({this.state.applications.length})</button>
          <button
            id="voting"
            type="button"
            className="btn btn-info tab"
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
                  <Link to={`/applications/${listingHash}`} className="listing">{application.data.listingName} </Link>
                </li>
              )
            })}
        </ul>
        : <div className="no-listings">
            No listings in this category.
          </div>
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