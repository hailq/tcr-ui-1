import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './Home';
import ApproveTokens from './ApproveTokens';
import RegisterApplication from './RegisterApplication';
import Applications from './Applications';

// TODO: connect with metamask,
// make nav bar with user info (how many tokens)
const App = (props) => {
    return (
      <Router>
        <div>
          <Route exact path='/' component={Home} />
          <Route path='/approve-tokens' component={ApproveTokens} />
          <Route path='/register-application' component={RegisterApplication} />
          <Route path='/applications' component={Applications} />
        </div>
      </Router>
    );
}

export default App;