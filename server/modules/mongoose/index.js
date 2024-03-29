//Mongoose plugin

const path = require(`path`);
const fs = require(`fs`);

const isValidName = require(`../../lib/isValidName`);
const {MONGO_URL} = process.env;

const mongoose = require(`mongoose`);
mongoose.Promise = global.Promise; //Global is zelfde als window in de browser

mongoose.connect(MONGO_URL, {useMongoClient: true}); //url in de .env file

module.exports.register = (server, options, next) => {

  const base = path.resolve(__dirname, `models`);

  fs.readdirSync(base).forEach(f => {

    if(!isValidName(f)) return;

    const ff = path.resolve(base, f);
    const {schema, name = path.basename(f, `.js`)} = require(ff);

    mongoose.model(name, schema);

  });

  next();

};

module.exports.register.attributes = {
  name: `mongoose`,
  version: `0.1.0`
};
