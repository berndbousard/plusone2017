import React from 'react';
import {Link} from 'react-router-dom';

const About = () => {
	return (
		<section className="about">
			<header>
				<h1>Dit is de about pagina</h1>
				<Link to="/home">ga naar de home pagina</Link>
			</header>
		</section>
	);
};

export default About;
