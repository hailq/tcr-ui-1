import React from 'react';
import { NavLink } from 'react-router-dom';

import { Nav, NavItem } from 'reactstrap';

export default function NavBar() {
  return (
    <div className="header bg-dark">
      <span className="glyphicon glyphicon-road"></span>
      <span id="registry-name">
        <strong>Token Curated Registry</strong>
      </span>

      <span className="float-right">
        {/* <Nav>
          <NavItem>
            <NavLink to='/' className="nav-link">
              Listings
            </NavLink>
          </NavItem>
        </Nav>
        <Nav>
          <NavItem>
            <NavLink to='/apply' className="nav-link">
              Apply
            </NavLink>
          </NavItem>
        </Nav>
        <Nav>
          <NavItem>
            <NavLink to='/account' className="nav-link">
              Account
            </NavLink>
          </NavItem>
        </Nav>
        <Nav>
          <NavItem>
            <NavLink to='/remove' className="nav-link">
              Remove an Application
            </NavLink>
          </NavItem>
        </Nav> */}

        <ul className="nav">
          <li className="nav-item">
            <NavLink to='/' className="nav-link">
              Listings
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to='/apply' className="nav-link">
              Apply
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to='/account' className="nav-link">
              Account
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to='/remove' className="nav-link">
              Remove an Application
            </NavLink>
          </li>
        </ul>
      </span>
    </div>
  )
}