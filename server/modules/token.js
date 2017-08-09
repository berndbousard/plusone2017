const jwt = require(`jsonwebtoken`);
const {SECRET, URL: issuer} = process.env;

module.exports.register = (server, options, next) => {

  //decorate uw reply met een token
  server.decorate(`reply`, `token`, function(user, {audience}){

    const reply = this;
    let {_id: subject} = user;
    subject = `${subject}`;

    const token = jwt.sign(
      user,
      SECRET,
      {
        expiresIn: `7d`,
        issuer,
        audience,
        subject
      }
    );

    return reply({token});
  });

  next();
};

module.exports.register.attributes = {
  name: `token`,
  version: `0.1.0`
};
