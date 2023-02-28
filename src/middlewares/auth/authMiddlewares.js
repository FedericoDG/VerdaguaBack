const { SUPER, ADMIN, USER } = require('../../constants/roles');
const jwt = require('../../helpers/jwt');

module.exports = {
  tokenIsValid: (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({
        status: 'unauthorized',
        msg: 'Acceso denegado. Debes enviar un token valido'
      });
    }
    const bearer = token.split('Bearer ')[1];
    const auth = jwt.verify(bearer);
    if (!bearer || !auth) {
      return res.status(403).json({
        status: 'denied',
        msg: 'Token no válido o expirado'
      });
    } else {
      req.user = jwt.decode(bearer);
      req.token = bearer;
      next();
    }
  },
  isUser: (req, res, next) => {
    const { user } = req;
    if (user.rol.name === SUPER || user.rol.name === ADMIN || user.rol.name === USER) {
      return next();
    } else {
      return res.status(403).json({
        status: 'unauthorized',
        msg: 'Acceso denegado'
      });
    }
  },
  isAdmin: (req, res, next) => {
    const { user } = req;
    if (user.rol.name === SUPER || user.rol.name === ADMIN) {
      return next();
    } else {
      return res.status(403).json({
        status: 'unauthorized',
        msg: 'Acceso denegado'
      });
    }
  },
  isSuper: (req, res, next) => {
    const { user } = req;
    if (user.rol.name === SUPER) {
      return next();
    } else {
      return res.status(403).json({
        status: 'unauthorized',
        msg: 'Acceso denegado'
      });
    }
  }
};
