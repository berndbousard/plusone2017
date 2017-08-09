const boom = require('boom');
const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);
const {pick, omit} = require('lodash');
const {User} = require(`mongoose`).models;

const basePath = `/api/users`;

module.exports = [

  {
    method: 'GET',
    path: `${basePath}/{id?}`,
    config: {
      validate: {
        params: {
          'id': joi.objectId()
        }
      },
      auth: {
        strategy: `token`
      }
    },
    handler: function(request, reply) {

      const {id} = request.params;
      const projection = `-__v`;

      if(!id){

        User.find({}, projection)
          .then(users => {
            return reply({users});
          })
          .catch(({errmsg}) => {
            console.log(errmsg);
            return reply(boom.badRequest());
          });

      } else {

        User.find({_id: id}, projection).limit(1)
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
    }
  },

  {
    method: 'POST',
    path: basePath,
    config: {
      validate: {
        options: {
          abortEarly: false
        },
        payload: {
          'email': joi.string().required(),
          'password': joi.string().required()
        }
      }
    },
    handler: function(request, reply) {

      const data = pick(request.payload, [`email`, `password`]);
      const user = new User(data);
      const projection = `-__v`;

      user.save()
        .then(user => {
          user = omit(user.toJSON(), [`__v`]);
          return reply(user);
        })
        .catch((e) => {
          console.log(errmsg);
          return reply(boom.badRequest());
        });

    }
  },

  {
    method: 'PATCH',
    path: `${basePath}/{id}`,
    config: {
      validate: {
        params: {
          'id': joi.objectId()
        },
        payload: {
          'email': joi.string().optional(),
          'password': joi.string().optional()
        }
      }
    },
    handler: function(request, reply) {

      const {id} = request.params;
      const data = pick(request.payload, [`email`, `password`]);

      User.findByIdAndUpdate(id, { $set: data }, { new: true })
        .then(user => {
          user = omit(user.toJSON(), [`__v`]);
          return reply(user);
        })
        .catch(({errmsg}) => {
          return reply(boom.badRequest())
        });
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

      const {id} = request.params;

      User.findByIdAndRemove(id)
        .then(user => {
          user = omit(user.toJSON(), [`__v`]);
          return reply(user);
        })
        .catch(({errmsg}) => {
          console.log(errmsg);
          return reply(boom.badRequest());
        });

    }
  }
]
