import React from 'react';
import { Link } from 'react-router-dom';

const Home = (props) => {
  return (
    <div>
      <h3>TCR App</h3>
      <ul>
        <li><Link to='/approve-tokens'>Approve Tokens</Link></li>
        <li><Link to='/register-application'>Register an application</Link></li>
        <li><Link to='/applications'>See all applications</Link></li>
      </ul>
    </div>
  );
}

export default Home;