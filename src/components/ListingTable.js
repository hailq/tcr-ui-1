import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';

class ListingTable extends Component {
  render() {
    const listings = this.props.listings;

    return (
      <ListGroup>
        {
        listings.length > 0
          ? listings.map((application) => {
            const listingHash = application.listingHash;
            return (
              <ListGroupItem key={listingHash}>
                <Link to={`/applications/${listingHash}`} className="listing">{application.data.listingName} </Link>
              </ListGroupItem>
            )})
          : <ListGroupItem>
            No listings in this category.
          </ListGroupItem>
        }
      </ListGroup>
    )
  }
}

export default ListingTable;