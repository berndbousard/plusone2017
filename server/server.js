const path = require(`path`);
const hapi = require(`hapi`);
const jwt = require(`jsonwebtoken`);
const pluginHandler = require(`./lib/pluginHandler`);

require(`dotenv`).config(); //Use .env for local variables
const {PORT, URL, SECRET} = process.env;

const server = new hapi.Server({
	connections: {
		routes: {
			files: {
				relativeTo: path.join(__dirname, `dist`)
			}
		}
	}
});

server.connection({port: PORT});

//Connection with DDB
//server.app.db = mongojs('plusone');

server.register(require(`./modules/`), pluginHandler);
server.register(require(`./routes/`), pluginHandler);

server.auth.strategy(`token`, `jwt`, {key: SECRET, verifyOptions: {issuer: URL}});

server.start((err) => {

	if(err) throw err;
	console.log(`Server running at: ${server.info.uri}`);

});
