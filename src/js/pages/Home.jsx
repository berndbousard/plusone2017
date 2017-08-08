import React from 'react';
import {Link} from 'react-router-dom';

const Home = () => {
	return (
		<section className="home">
			<header>
				<h1>PlusOne Amsterdam</h1>
				<Link to="/about">About</Link>
			</header>
		</section>
	);
};

export default Home;
