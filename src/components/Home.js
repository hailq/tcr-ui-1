import React from 'react';
import { Link } from 'react-router-dom';

const Home = (props) => {
  return (
    <div>
      <h3>TCR Application</h3>
      <ul>
        <li><Link to='/approve-tokens'>Apply</Link></li>
        <li><Link to='/'>See all applications</Link></li>
      </ul>
    </div>
  );
}

export default Home;