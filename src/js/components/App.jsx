import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import Test from '../Pages/Test.jsx';

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Link to="/test">dan gaan we kijken</Link>
          <Route path="/test" component={Test} />
        </div>
      </Router>
    )
  }
}
