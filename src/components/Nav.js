import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <div className="header bg-dark">
      <span className="glyphicon glyphicon-road"></span>
      <span id="registry-name">
        <strong>Token Curated Registry</strong>
      </span>
      <span className="float-right">
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
      <div><hr className="my-3" /></div>
    </div>
  )
}