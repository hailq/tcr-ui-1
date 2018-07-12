import React, { Component } from 'react';
import { connect } from 'react-redux';

class Account extends Component {
  render() {
    return (
      <div>
        <div className="title">
          <h3>Your Account</h3>
        </div>
        <ul className="list-group">
          <li className="list-group-item">
            <b>Ether:</b> {this.props.ether ? this.props.ether.toString() : 0}
          </li>
          <li className="list-group-item">
            <b>Tokens:</b> {this.props.token ? this.props.token.toString() : 0}
          </li>
          <li className="list-group-item">
            <b>Approved Tokens:</b> {this.props.allowance ? this.props.allowance.toString() : 0}
          </li>
        </ul>
      </div>
    );
  }
}

function mapStateToProps({ account }) {
  return account;
}

export default connect(mapStateToProps)(Account);