import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Nav from './Nav';
import Account from './Account';
import ApproveTokens from './ApproveTokens';
import RegisterApplication from './RegisterApplication';
import Applications from './Applications';
import Remove from './Remove';
import Listing from './Listing';
import Challenge from './Challenge';
import Vote from './Vote';

import { 
  setUserInfo
} from '../actions/account'

// TODO: connect with metamask,
// make nav bar with user info (how many tokens)
class App extends Component {
  componentDidMount() {
    this.props.dispatch(setUserInfo());
  }

  render() {
    return (
      <Router>
        <div>
          <Nav />
          <div>
            <Route exact path='/' component={Applications} />
            <Route path='/approve-tokens' component={ApproveTokens} />
            <Route path='/register-application' component={RegisterApplication} />
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