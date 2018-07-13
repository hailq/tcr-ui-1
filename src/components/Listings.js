import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ListingTable from './ListingTable';

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

        <Button
          id="registry"
          onClick={this.handleTabChange}
          className="tab text-left"
          color="info"
          size="sm"
          block
        >Registry ({this.state.registry.length})</Button>
        <Collapse isOpen={this.state.currentTab === 'registry'}>
          <ListingTable listings={this.state.registry}/>
        </Collapse>
        <Button
          id="applications"
          onClick={this.handleTabChange}
          className="tab text-left"
          color="info"
          size="sm"
          block
        >Applications ({this.state.applications.length})</Button>
        <Collapse isOpen={this.state.currentTab === 'applications'}>
          <ListingTable listings={this.state.applications} />
        </Collapse>
        <Button
          id="voting"
          onClick={this.handleTabChange}
          className="tab text-left"
          color="info"
          size="sm"
          block
        >Voting ({this.state.voting.length})</Button>
        <Collapse isOpen={this.state.currentTab === 'voting'}>
          <ListingTable listings={this.state.voting} />
        </Collapse>
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