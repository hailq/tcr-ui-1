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
import Reveal from './Reveal';

import { handleGetAllData } from '../actions';
// import { setRegistryEventListener, setPLCREventListener } from '../web3';

class App extends Component {
  componentDidMount() {
    console.log();
    this.props.dispatch(handleGetAllData());
    // setRegistryEventListener("", (result) => {
    //   console.log(result);
    // });
    // setPLCREventListener((result) => {
    //   console.log(result);
    // });
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
            <Route path='/applications/:id/reveal' component={Reveal} />
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