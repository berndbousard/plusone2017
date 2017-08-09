const joi = require('joi');
const boom = require('boom');

const {User} = require(`mongoose`).models;
const basePath = `/api/auth`;

module.exports = [
  {
    method: `POST`,
    path: basePath,
    config: {
      validate: {
        options: {
          abortEarly: false
        },
        payload: {
          email: joi.string().required(),
          password: joi.string().required(),
          audience: joi.string().required()
        }
      }
    },
    handler: (request, reply) => {

      const {email, password, audience} = request.payload;

      User.findOne({email})
        .then((user) => {

          if(!user){
            return reply(boom.notFound(`No user found with that login`));
          }

          user.verifyPassword(password, (err, isValid) => {
            if(err || !isValid){
              // TODO: Remove password in error message
              return reply(boom.badRequest(`Password incorrect`));
            }

            //Send token to client
            return reply.token(user, {audience});
          });

        })
        .catch(() => {
          return reply(boom.badRequest(`Error while authenticating user`));
        });
    }
  }

];
