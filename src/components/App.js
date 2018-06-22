import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './Home';
import ApproveTokens from './ApproveTokens';
import RegisterApplication from './RegisterApplication'

const App = (props) => {
    return (
      <Router>
        <div>
          <Route exact path='/' component={Home} />
          <Route path='/approve-tokens' component={ApproveTokens} />
          <Route path='/register-application' component={RegisterApplication} />
        </div>
      </Router>
    );
}

export default App;