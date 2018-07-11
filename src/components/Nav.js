import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <div className="navigation">
      <div className="navbar">
        <ul className="nav">
          <li className="nav-item">
            <NavLink to='/' className="nav-link">
              Listings
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to='/apply' className="nav-link active">
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
      </div>
      <div><hr className="my-3" /></div>
    </div>
  )
}