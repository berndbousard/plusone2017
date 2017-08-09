const boom = require(`boom`);
const joi = require(`joi`);
joi.objectId = require(`joi-objectid`)(joi);
const {pick, omit} = require(`lodash`);
const {User} = require(`mongoose`).models;
const path = require(`path`);
const fs = require(`fs`);

const basePath = `/api/images`;

module.exports = [

	{
		method: `GET`,
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
					.catch(() => {
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
					.catch(() => {
						return reply(boom.badRequest());
					});

			}
		}
	},

	{
		method: `POST`,
		path: basePath,
		config: {
			validate: {
				options: {
					abortEarly: false
				},
				payload: {
					image: joi.any().required()
				}
			},

			payload: {
				output: `stream`,
				parse: true,
				allow: `multipart/form-data`
			}
		},
		handler: function(request, reply) {

			const {image} = request.payload;
			const imageName = Math.random().toString(36).substr(2, 12); //Create random string
			const imageExtention = path.extname(image.hapi.filename);
			const imageLocation = path.join(__dirname, `../../dist/uploads`, `${imageName}${imageExtention}`);

			const imageFile = fs.createWriteStream(imageLocation);
			image.pipe(imageFile);

		}
	},

	{
		method: `PATCH`,
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
				.catch(() => {
					return reply(boom.badRequest());
				});
		}
	},

	{
		method: `DELETE`,
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
				.catch(() => {
					return reply(boom.badRequest());
				});

		}
	}
];
