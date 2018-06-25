import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <div>
      <div className="navbar">
        <ul className="nav">
          <li className="nav-item">
            <NavLink to='/' className="nav-link active">
              Applications
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to='/register-application' className="nav-link active">
              Apply
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to='/approve-tokens' className="nav-link active">
              Approve Tokens
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to='/account' className="nav-link active">
              Account
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to='/remove' className="nav-link active">
              Remove an Application
            </NavLink>
          </li>
        </ul>
      </div>
      <div><hr className="my-3" /></div>
    </div>
  )
}