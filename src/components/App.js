import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Home from './Home';
import UserInfo from './UserInfo';
import ApproveTokens from './ApproveTokens';
import RegisterApplication from './RegisterApplication';
import Applications from './Applications';

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
          <UserInfo />
          <div>
            <Route exact path='/' component={Home} />
            <Route path='/approve-tokens' component={ApproveTokens} />
            <Route path='/register-application' component={RegisterApplication} />
            <Route path='/applications' component={Applications} />
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