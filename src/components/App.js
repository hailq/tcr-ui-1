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

import { Alert } from 'reactstrap';

import { handleGetAllData } from '../actions';
import { getAccount, registryInstance } from '../web3/web3';
import { _APPLICATION, _CHALLENGE, _LISTINGWITHDRAWN } from '../events';
import { registerApplication, getAllApplicationData, removeApplication } from '../actions/applications';
import { setUserInfo } from '../actions/account'
import { handleNewChallenge } from '../actions/challenges';

import '../App.css';

class App extends Component {
  state = {
    addressIsValid: false,
    isCheckingAddress: true
  }

  componentDidMount() {
    this.updateState();
  }

  // Check if the network address is valid, then call the callback function with
  // the result.
  validateAddress = (callback) => {
    registryInstance.token((error, result) => {
      if (error) {
        console.log(error);
      } else {
        let addressIsValid = result === '0x' ? false : true;
        callback(addressIsValid);
      }
    })
  }

  updateState = () => {
    this.validateAddress((addressIsValid) => {
      if (addressIsValid) {
        this.props.dispatch(handleGetAllData());
        
        // set an interval to update when user changes their account.
        this.interval = setInterval(() => {
          getAccount((account) => {
            if (account !== this.props.account) {
              this.props.dispatch(setUserInfo());
            }
          })
        }, 100);

        // contract event listeners
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
      this.setState({
        addressIsValid,
        isCheckingAddress: false
      })
    });
  }

  render() {
    if (!this.state.isCheckingAddress) {
      return (
        <div>
          <Router>
            <div className="app">
              <Nav />
              
              {this.state.addressIsValid ?
              <div className="content">
                <Route exact path='/' component={Listings} />
                <Route path='/apply' component={Apply} />
                <Route path='/account' component={Account} />
                <Route path='/remove' component={Remove} />
                <Route exact path='/applications/:id' component={Listing} />
                <Route path='/applications/:id/challenge' component={Challenge} />
                <Route path='/applications/:id/vote' component={Vote} />
                <Route path='/applications/:id/reveal' component={Reveal} />
              </div> :
              <Alert color="danger">
                <legend>
                  <strong><ion-icon name="close-circle"></ion-icon> Error:</strong>
                </legend>
                Your network address is incorrect. Please choose another network.
              </Alert>
              }
            </div>
          </Router>
        </div>
      );
    }
    return null;
  }
}

function mapStateToProps({ applications, account }) {
  return { 
    account: account.account,
    applications
  };
}

export default connect(mapStateToProps)(App);