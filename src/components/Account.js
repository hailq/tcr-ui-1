import React, { Component } from 'react';
import { connect } from 'react-redux';

class Account extends Component {
  render() {
    return (
      <div>
        <ul className="list-group">
          <li className="list-group-item">
            <b>Ether:</b> {this.props.ether}
          </li>
          <li className="list-group-item">
            <b>Tokens:</b> {this.props.token}
          </li>
          <li className="list-group-item">
            <b>Approved Tokens:</b> {this.props.allowance}
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