import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { updateStatus, challengeResolved } from '../web3/web3';
import { toMinuteAndSecond } from '../utils';

import { ListGroup, ListGroupItem, Button, Alert } from 'reactstrap';

class Listing extends Component {
  state = {
    successVisibility: false,
    errorVisibility: false,
    appState: '',
    timeTillCommit: -1,
    timeTillReveal: -1,
  }

  componentDidMount() {
    // Update the state every 1 second to show the countdown timer.
    this.interval = setInterval(() => {
      this.setState((prevState) => {
        let timeTillCommit = prevState.timeTillCommit - 1;
        let timeTillReveal = prevState.timeTillReveal - 1;
        let appState = '';
        if (prevState.appState === 'challenge') {
          appState = prevState.appState;
        } else {
          if (timeTillCommit > 0) {
            appState = 'vote';
          } else if (timeTillReveal > 0) {
            appState = 'reveal';
          } else {
            appState = 'updateStatus';
          }
        }

        return {
          timeTillCommit,
          timeTillReveal,
          appState
        }
      })
    }, 1000);
    
    this.updateState();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) this.updateState();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateState = () => {
    const id = this.props.match.params.id;
    const listing = this.props.applications[id];
    let appState = '';

    if (listing) {
      let timeTillCommit = 0;
      let timeTillReveal = 0;

      challengeResolved(listing.challengeID, (resolved) => {
        if (listing.challengeID === '0' || resolved) {
          appState = 'challenge';
        } else {
          const challenge = this.props.challenges[listing.challengeID];
          
          const currTime = Math.floor(Date.now() / 1000);
          timeTillCommit = parseInt(challenge.commitEndDate, 10) - currTime;
          timeTillReveal = parseInt(challenge.revealEndDate, 10) - currTime;
          
          if (timeTillCommit > 0) {
            appState = 'vote';
          } else if (timeTillReveal > 0) {
            appState = 'reveal';
          } else {
            appState = 'updateStatus';
          }
        }
  
        this.setState({ appState, timeTillCommit, timeTillReveal });
      });
      
    }
  }

  handleUpdateStatus = () => {
    updateStatus(this.props.match.params.id, (error, result) => {
      if (error) {
        console.log(error);
        this.setState({errorVisibility: true});
      } else {
        console.log('Update status success.');
        this.setState({ successVisibility: true });
        // this.props.history.push('/')
        // window.location.reload(true);
      }
    });
  }

  render() {
    const id = this.props.match.params.id;
    const listing = this.props.applications[id];

    if (this.state.appState !== '' && listing) {
      const endDate = new Date(parseInt(listing.appEndDate) * 1000); // sec to millisec

      return (
        <div>
          <div className="title">
            <h3>{listing.data.listingName}</h3>
          </div>

          <ListGroup>
            <ListGroupItem><b>Listing Hash:</b> {listing.listingHash}</ListGroupItem>
            <ListGroupItem><b>Credential:</b> {listing.data.credential}</ListGroupItem>
            <ListGroupItem><b>Deposit:</b> {listing.data.deposit}</ListGroupItem>
            <ListGroupItem><b>Application End Date:</b> {endDate.toLocaleString()}</ListGroupItem>
            <ListGroupItem><b>Metadata:</b> {listing.data.metadata}</ListGroupItem>
          </ListGroup>

          <br />

          {/* Countdown clock */}
          {this.state.timeTillCommit > 0 &&
          <h4>Time to commit vote: {toMinuteAndSecond(this.state.timeTillCommit)}</h4>}
          {this.state.timeTillCommit < 0 && this.state.timeTillReveal > 0 &&
          <h4>Time to reveal vote: {toMinuteAndSecond(this.state.timeTillReveal)}</h4>}
          
          
          {this.state.appState === 'vote' &&
          <Button color="info">
            <Link
              className="button-link"
              to={`/applications/${id}/vote`}
            >
              Vote
            </Link>
          </Button>
          }

          {this.state.appState === 'challenge' && 
          <Button color="info">
            <Link
              className="button-link"
              to={`/applications/${id}/challenge`}
            >
              Challenge
            </Link>
          </Button>
          }

          {this.state.appState === 'reveal' &&
          <Button color="info">
            <Link
              className="button-link"
              to={`/applications/${id}/reveal`}
            >
              Reveal Vote
            </Link>
          </Button>
          }

          {this.state.appState === 'updateStatus' && <Button
            color="info"
            onClick={this.handleUpdateStatus}
          >Update Status</Button>
          }
          <br />

          {/* Success/error notifications. */}
          {this.state.successVisibility &&
          <Alert color="success">
            <strong><ion-icon name="checkmark-circle"></ion-icon> Update status successfully.</strong>
          </Alert>
          }
          {this.state.errorVisibility &&
          <Alert color="danger">
            <strong><ion-icon name="close-circle"></ion-icon> Error:</strong> Could not perform the request.
          </Alert>
          }
        </div>
      )
    }

    return <div></div>;
  }
}

function mapStateToProps({ applications, challenges }) {
  return { applications, challenges };
}

export default connect(mapStateToProps)(Listing);