import React from 'react';
import {Link} from 'react-router-dom';

const Home = () => {
	return (
		<section className="home">
			<header>
				<h1>Dit is de home pagina</h1>
				<Link to="/about">ga naar de about pagina</Link>
			</header>
		</section>
	);
};

export default Home;
