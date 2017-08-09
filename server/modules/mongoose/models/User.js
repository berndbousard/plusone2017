const Schema = require(`mongoose`).Schema;

const schema = new Schema ({
  name: {
    type: String,
    required: true,
    unique: true
  },

  age: {
    type: Number,
    required: true
  },

  job: {
    type: String,
    required: true
  }
});

module.exports = {schema};
