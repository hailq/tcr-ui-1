import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Nav from './Nav';
import Account from './Account';
import ApproveTokens from './ApproveTokens';
import Apply from './Apply';
import Listings from './Listings';
import Remove from './Remove';
import Listing from './Listing';
import Challenge from './Challenge';
import Vote from './Vote';

import { registryEventListener, getRemovedApplications, getWhitelistedApplications, getPastEvents, getListings } from '../web3';
import { _APPLICATION } from '../events';

import { 
  setUserInfo
} from '../actions/account';
import {
  handleGetInitialApplications
} from '../actions/applications'

// TODO: connect with metamask,
// make nav bar with user info (how many tokens)
class App extends Component {
  componentDidMount() {
    this.props.dispatch(setUserInfo());
    // get all applications.
    this.props.dispatch(handleGetInitialApplications());

    getPastEvents(_APPLICATION, getListings);
  }

  render() {
    return (
      <Router>
        <div>
          <Nav />
          <div>
            <Route exact path='/' component={Listings} />
            <Route path='/approve-tokens' component={ApproveTokens} />
            <Route path='/apply' component={Apply} />
            <Route path='/account' component={Account} />
            <Route path='/remove' component={Remove} />
            <Route exact path='/applications/:id' component={Listing} />
            <Route path='/applications/:id/challenge' component={Challenge} />
            <Route path='/applications/:id/vote' component={Vote} />
          </div>
        </div>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(App);