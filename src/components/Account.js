import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ListGroup, ListGroupItem } from 'reactstrap';

class Account extends Component {
  render() {
    return (
      <div>
        <div className="title">
          <h3>Your Account</h3>
        </div>

        <ListGroup>
          <ListGroupItem>
            <b>Ether:</b> {this.props.ether ? this.props.ether.toString() : 0}
          </ListGroupItem>
          <ListGroupItem>
            <b>Tokens:</b> {this.props.token ? this.props.token.toString() : 0}
          </ListGroupItem>
          <ListGroupItem>
            <b>Approved Tokens:</b> {this.props.allowance ? this.props.allowance.toString() : 0}
          </ListGroupItem>
        </ListGroup>
        
      </div>
    );
  }
}

function mapStateToProps({ account }) {
  return account;
}

export default connect(mapStateToProps)(Account);