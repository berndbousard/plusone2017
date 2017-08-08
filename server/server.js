const path = require('path');
const hapi = require('hapi');
const inert = require('inert');
const mongojs = require('mongojs');

require('dotenv').config(); //Use .env for local variables
const {PORT, URL} = process.env;


const server = new hapi.Server({
	connections: {
		routes: {
			files: {
				relativeTo: path.join(__dirname, 'dist')
			}
		}
	}
});

server.connection({port: PORT});

//Connection with DDB
server.app.db = mongojs('plusone');

server.register([inert, require('./routes/users')], (err) => {
	if(err) throw err;
});

// static assets
server.route({
	method: 'GET',
	path: '/{param*}',
	handler: {
		directory: {
			path: path.join(__dirname, 'dist'),
			listing: false,
			index: 'index.html'
		}
	}
});

// if page not found - return the index page
server.ext('onPostHandler', (request, reply) => {
	const response = request.response;
	if (response.isBoom && response.output.statusCode === 404) {
		return reply.file(path.join(__dirname, 'dist', 'index.html'));
	}
	return reply.continue();
});


server.start((err) => {
	if(err) throw err;

	console.log(`Server running at: ${server.info.uri}`);
});
