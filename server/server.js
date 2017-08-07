const path = require(`path`)
const hapi = require('hapi');
const inert = require('inert');

const server = new hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: path.join(__dirname, `dist`)
      }
    }
  }
});

server.connection({ port:3000, host: 'localhost' });

server.register(inert, (err) => {
  if(err) throw err;
});

server.route({
  method: 'GET',
  path: '/{params*}',
  handler: {
    directory: {
      path: path.join(__dirname, 'dist'),
      listing: false,
      index: true
    }
  }
});

server.start((err) => {
  if(err) throw err;

  console.log(`Server running at: ${server.info.uri}`);
});
