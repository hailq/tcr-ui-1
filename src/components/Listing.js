import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { updateStatus, challengeResolved } from '../web3';
import { toMinuteAndSecond } from '../utils';
import { handleGetInitialApplications } from '../actions/applications';

class Listing extends Component {
  state = {
    appState: '',
    timeTillCommit: -1,
    timeTillReveal: -1,
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState((prevState) => ({
        timeTillCommit: prevState.timeTillCommit - 1,
        timeTillReveal: prevState.timeTillReveal - 1,
      }))
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

      if (listing.challengeID === '0' || challengeResolved(listing.challengeID)) {
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
    }
  }

  handleUpdateStatus = () => {
    this.props.history.push('/')
    updateStatus(this.props.match.params.id, (result) => {
      console.log('Update status success.');
      this.props.dispatch(handleGetInitialApplications());
    });
  }

  render() {
    const id = this.props.match.params.id;
    const listing = this.props.applications[id];

    if (this.state.appState !== '') {
      return (
        <div>
          <h3>{listing.data.listingName}</h3>
          <ul className="list-group">
            <li className="list-group-item"><b>Listing Hash:</b> {listing.listingHash}</li>
            <li className="list-group-item"><b>Credential:</b> {listing.data.credential}</li>
            <li className="list-group-item"><b>Deposit:</b> {listing.data.deposit}</li>
            <li className="list-group-item"><b>Application End Date: </b> {listing.appEndDate}</li>
          </ul>

          {this.state.timeTillCommit > 0 &&
          <h4>Time to commit {toMinuteAndSecond(this.state.timeTillCommit)}</h4>}
          {this.state.timeTillCommit < 0 && this.state.timeTillReveal > 0 &&
          <h4>Time to reveal {toMinuteAndSecond(this.state.timeTillReveal)}</h4>}
          {this.state.timeTillCommit > 0 && this.state.appState === 'vote' &&
          <Link
            to={`/applications/${id}/vote`}
          >Vote</Link>}
          {this.state.appState === 'challenge' && <Link
            to={`/applications/${id}/challenge`}
          >Challenge</Link>}
          {this.state.timeTillCommit < 0 && this.state.timeTillReveal > 0 && this.state.appState === 'reveal' &&
          <Link
            to={`/applications/${id}/reveal`}
          >Reveal Vote</Link>}
          {this.state.appState === 'updateStatus' && <button
            className="btn btn-info"
            onClick={this.handleUpdateStatus}
          >Update Status</button>}
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