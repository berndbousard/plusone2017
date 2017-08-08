const boom = require('boom');
const uuid = require('uuid');
const joi = require('joi');

const basePath = `/api`;

//Syntax for new hapi plugin
exports.register = function(server, options, next) {

  const db = server.app.db;

  server.route({
    method: 'GET',
    path: `${basePath}/users`,
    handler: function(request, reply) {
      db.users.find((err, res) => {

        if(err){
          return reply(Boom.wrap(err, `Internal MongoDB error`))
        }

        reply(res);

      })
    }
  });


  return next();
}

exports.register.attributes = {
  name: `routes-users`,
  version: `1.0.0`
}
