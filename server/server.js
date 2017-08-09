const path = require('path');
const hapi = require('hapi');
const inert = require('inert');
const mongojs = require('mongojs');
const pluginHandler = require('./lib/pluginHandler');

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

server.register(require(`./modules/`), pluginHandler);
server.register(require(`./routes/`), pluginHandler);

server.start((err) => {

	if(err) throw err;
	console.log(`Server running at: ${server.info.uri}`);

});
