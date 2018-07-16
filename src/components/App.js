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
import { registryInstance } from '../web3/web3';
import { _APPLICATION, _CHALLENGE, _LISTINGWITHDRAWN } from '../events';
import { registerApplication, getAllApplicationData, removeApplication } from '../actions/applications';
import { handleNewChallenge } from '../actions/challenges';

import '../App.css';

class App extends Component {
  state = {
    addressIsValid: false,
    loadingFinished: false
  }

  componentDidMount() {
    this.validateAddress();

    if (this.state.addressIsValid) {
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
  }

  componentDidUpdate(prevProps) {
    if (this.props.applications != prevProps.applications) {
      this.validateAddress();
    }
  }

  validateAddress = () => {
    registryInstance.token((error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
        let addressIsValid = true;
        if (result === '0x') addressIsValid = false;
        this.setState({
          addressIsValid,
          loadingFinished: true,
        })
      }
    })
  }

  updateState = () => {

  }

  render() {
    if (this.state.loadingFinished) {
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
                <strong><ion-icon name="close-circle"></ion-icon> Error:</strong> Could not load the application. Please check your network address.
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

function mapStateToProps({ applications }) {
  return { applications };
}

export default connect(mapStateToProps)(App);