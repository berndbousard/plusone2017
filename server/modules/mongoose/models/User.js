const Schema = require(`mongoose`).Schema;

const schema = new Schema ({
	email: {
		type: String,
		required: true,
		unique: true
	},

	password: {
		type: String,
		required: true,
		bcrypt: true
	},

	created: {
		type: Date,
		default: Date.now
	}
});

schema.plugin(require(`mongoose-bcrypt`));

module.exports = {schema};
