const boom = require('boom');
const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);
const lodash = require('lodash');
const {User} = require(`mongoose`).models;

const basePath = `/api/users`;

module.exports = [

  {
    method: 'GET',
    path: `${basePath}`,
    handler: function(request, reply) {

      User.find()
        .then(users => {
          return reply({users});
        })
        .catch(({errmsg}) => {
          console.log(errmsg);
          return reply(boom.badRequest());
        });
    }
  },

  {
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

      User.findOne()
        .then(user => {
          if(!user){
            return reply(boom.notFound());
          }
          return reply(user);
        })
        .catch(({errmsg}) => {
          console.log(errmsg);
          return reply(boom.badRequest());
        });
    }
  },

  {
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

      const data = request.payload;
      const user = new User(data);

      user.save()
        .then((user) => {
          return reply(user);
        })
        .catch(({errmsg}) => {
          console.log(errmsg);
          return reply(boom.badRequest());
        });

    }
  }

  /*,

  {
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
  },


  {
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
  }

  */
]
