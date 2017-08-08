const boom = require('boom');
const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);
const lodash = require('lodash');

const basePath = `/api/users`;

//Syntax for new hapi plugin
exports.register = function(server, options, next) {

  const db = server.app.db;

  //fetch all
  server.route({
    method: 'GET',
    path: `${basePath}`,
    handler: function(request, reply) {
      db.users.find((err, res) => {

        if(err){
          return reply(boom.boomify(`Internal MongoDB error`));
        }

        if(lodash.isEmpty(res)){
          return reply(boom.notFound(`No users found`));
        }

        reply(res);

      });
    }
  });

  //fetch one
  server.route({

    method: 'GET',
    path: `/api/users/{id}`,
    config: {
      validate: {
        params: {
          'id': joi.objectId()
        }
      }
    },
    handler: function(request, reply) {

      db.users.findOne({
        _id: request.params.id
      }, (err, res) => {

        console.log(request.params.id);

        if(err){
          return reply(boom.boomify(`Internal MongoDB error`))
        }

        if(!res){
          return reply(boom.notFound(`No user found`));
        }

        reply(res);

      });
    }

  });

  //post
  server.route({
    method: 'POST',
    path: `${basePath}`,
    config: {
      validate: {
        payload: {
          'name': joi.string().required(),
          'age': joi.number().required(),
          'job': joi.string().required()
        }
      }
    },
    handler: function(request, reply) {

      const user = request.payload;

      db.users.save(user, (err, result) => {

        if(err){
          return reply(boom.boomify(`Internal MongoDB error`));
        }

        reply(user);

      });

    }
  });

  //patch
  server.route({
    method: 'PATCH',
    path: `${basePath}/{id}`,
    config: {
      validate: {
        params: {
          'id': joi.objectId()
        },
        payload: {
          'name': joi.string().optional(),
          'age': joi.number().optional(),
          'job': joi.string().optional()
        }
      }
    },
    handler: function(request, reply) {
      db.users.update({
        _id: request.params.id
      }, {
        $set: request.payload
      }, function (err, result){

        if(err){
          return reply(boom.boomify(`Interal MongoDB error`));
        }


        if(lodash.isEmpty(result)){
          return reply(Boom.notFound());
        }

        reply().code(204);


      }
    );
    }
  })

  //delete
  server.route({
    method: 'DELETE',
    path: `${basePath}/{id}`,
    config: {
      validate: {
        params: {
          'id': joi.objectId()
        },
      }
    },
    handler: function(request, reply) {


      db.users.remove({
        _id: request.params.id
      }, function(err, result) {

        if(err) reply(boom.boomify(`Interal MongoDB error`));

        if(lodash.isEmpty(result)){
          return reply(boom.notFound());
        }

        reply().code(204);

      });


    }
  });

  return next();
}

exports.register.attributes = {
  name: `routes-users`,
  version: `1.0.0`
}
