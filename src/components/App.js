import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Nav from './Nav';
import Account from './Account';
import Apply from './Apply';
import Listings from './Listings';
import Remove from './Remove';
import Listing from './Listing';
import Challenge from './Challenge';
import Vote from './Vote';
import Reveal from './Reveal';

import { handleGetAllData } from '../actions';
import { registryInstance } from '../web3';
import { _APPLICATION, _CHALLENGE, _LISTINGWITHDRAWN } from '../events';
import { registerApplication, getAllApplicationData, removeApplication } from '../actions/applications';
import { handleNewChallenge } from '../actions/challenges';

import '../App.css';

class App extends Component {
  componentDidMount() {
    this.props.dispatch(handleGetAllData());
    
    registryInstance[_APPLICATION]().watch((error, result) => {
      if (error) {
        console.log(error);
      } else {
        getAllApplicationData(result, (application) => {
          this.props.dispatch(registerApplication(application));
        });
      }
    })

    registryInstance[_CHALLENGE]().watch((error, result) => {
      if (error) {
        console.log(error);
      } else {
        const challengedListing = this.props.applications[result.args.listingHash];
        if (challengedListing)
          this.props.dispatch(handleNewChallenge(result, challengedListing));
      }
    })

    registryInstance[_LISTINGWITHDRAWN]().watch((error, result) => {
      const withdrawnListingHash = result.args.listingHash;
      if (error) {
        console.log(error);
      } else {
        this.props.dispatch(removeApplication(withdrawnListingHash));
      }
    })
  }

  render() {
    return (
      <div>
        <Router>
          <div className="app">
            <Nav />
            <div className="content">
              <Route exact path='/' component={Listings} />
              <Route path='/apply' component={Apply} />
              <Route path='/account' component={Account} />
              <Route path='/remove' component={Remove} />
              <Route exact path='/applications/:id' component={Listing} />
              <Route path='/applications/:id/challenge' component={Challenge} />
              <Route path='/applications/:id/vote' component={Vote} />
              <Route path='/applications/:id/reveal' component={Reveal} />
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

function mapStateToProps({ applications }) {
  return { applications };
}

export default connect(mapStateToProps)(App);