import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import {Home, About} from '../pages';

const App = () => {
	return (
		<Router>
			<Switch>
				<Route path="/home" exact component={Home} />
				<Route path="/about" exact component={About} />

				<Redirect from="/*" to="/home"/>
			</Switch>
		</Router>
	);
};

export default App;
