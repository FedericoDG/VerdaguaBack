const jsonWebToken = require('jsonwebtoken');

module.exports = jwt = {
  sign: (object) => {
    return jsonWebToken.sign(object, process.env.SECRET);
  },
  decode: (token) => {
    return jsonWebToken.decode(token, process.env.SECRET);
  },
  verify: (token) =>
    jsonWebToken.verify(token, process.env.SECRET, (error) => {
      if (error) return false;

      return true;
    })
};
