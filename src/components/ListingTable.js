import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

class ListingTable extends Component {
  render() {
    {
      listings.length > 0
      ? <ListGroup>
          {listings.map((application) => {
            const listingHash = application.listingHash;
            return (
              <ListGroupItem key={listingHash} className="list-group-item">
                <Link to={`/applications/${listingHash}`} className="listing">{application.data.listingName} </Link>
              </ListGroupItem>
            )
          })}
      </ListGroup>
      : <ListGroup>
          <ListGroupItem>
            No listings in this category.
          </ListGroupItem>
        </ListGroup>
      }
  }
}

export default ListingTable;