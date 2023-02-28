const jsonWebToken = require('jsonwebtoken');

module.exports = jwt = {
    //Creates a security token
    sign: (object) => {
        return jsonWebToken.sign(object, process.env.SECRET);
    },
    //Re-creates data from token
    decode: (token) => {
        return jsonWebToken.decode(token, process.env.SECRET);
    },
    //Checks token's validation
    verify: (token) =>
        jsonWebToken.verify(token, process.env.SECRET, (error) => {
            if (error) return false;

            return true;
        })
};
