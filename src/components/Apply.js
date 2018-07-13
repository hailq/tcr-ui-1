import React, { Component } from 'react';
import { apply } from '../web3';

import { FormGroup, Input, Label, Button, Alert, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class Apply extends Component {
  state = {
    errorVisibility: false,
    dropdownOpen: false,
    listingName: '',
    registry: 'Math Experts',
    credential: '',
    deposit: '',
    metadata: ''
  }

  handleChange = (e) => {
    const id = e.target.id;
    this.setState({
      [id]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const listing = {
      listingName: this.state.listingName,
      registry: this.state.registry,
      credential: this.state.credential,
      deposit: this.state.deposit,
      metadata: this.state.metadata
    };
    apply(listing, (error, result) => {
      if (error) {
        console.log(error);
        this.setState({errorVisibility: true,})
      } else {
        console.log(`Application ${listing.listingName} success.`);
      }
    })
  }

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  getSelectedDropdownItem = (e) => {
    this.setState({
      registry: e.target.value
    })
  }

  render() {
    return (
      <div>
        <div className="title">
          <h3>Register Listing</h3>
        </div>

        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label>Listing Name: </Label>
            <Input
              type="text"
              id="listingName"
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Registry: </Label>
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle color="light" caret>
                {this.state.registry}
              </DropdownToggle>
              <DropdownMenu onClick={this.getSelectedDropdownItem}>
                <DropdownItem value="Math Experts">Math Experts</DropdownItem>
                <DropdownItem value="Physics Experts">Physics Experts</DropdownItem>
                <DropdownItem value="Chemistry Experts">Chemistry Experts</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </FormGroup>
          
          <FormGroup>
            <Label>Credential: </Label>
            <Input
              type="text"
              id="credential"
              onChange={this.handleChange}  
            />
          </FormGroup>
          <FormGroup>
            <Label>Deposit: </Label>
            <Input
              type="text"
              id="deposit"
              onChange={this.handleChange}  
            />
          </FormGroup>
          <FormGroup>
            <Label>Metadata: </Label>
            <Input
              type="text"
              id="metadata"
              onChange={this.handleChange}  
            />
          </FormGroup>

          <Button type="submit" color="info">Submit Application</Button>
        </form>
        <br />
        {this.state.errorVisibility &&
        <Alert color="danger">
          <strong>Error:</strong> Could not create application. Make sure your account has sufficient ballance and the listing name is not in the registry.
        </Alert>
        }
      </div>
    );
  }
}

export default Apply;