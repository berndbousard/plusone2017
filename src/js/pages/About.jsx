import React from 'react';
import {Link} from 'react-router-dom';

const About = () => {
	return (
		<section className="about">
			<header>
				<h1>About</h1>
				<Link to="/home">home</Link>
			</header>
		</section>
	);
};

export default About;
