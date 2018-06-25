import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTotalTokens, getAllowance, getTotalEther } from '../web3'

class UserInfo extends Component {
  render() {
    return (
      <div>
        <div>
          Ether {this.props.ether}
        </div>
        <div>
          Token {this.props.token}
        </div>
        <div>
          Approved Token {this.props.allowance}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ account }) {
  return account;
}

export default connect(mapStateToProps)(UserInfo);