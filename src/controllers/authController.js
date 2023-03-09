const { validationResult } = require('express-validator');
const bcrypt = require('../helpers/bcrypt');
const jwt = require('../helpers/jwt');

module.exports = {
  login: async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const { password: storedPassword } = req.user;
        const { password } = req.body;
        const auth = await bcrypt.compare(password, storedPassword);
        if (!auth) {
          res.status(401).json({
            status: 'Unauthorized',
            msg: 'Las contraseñas no coinciden'
          });
        } else {
          const { user } = req;
          const { password, ...rest } = user;
          const token = jwt.sign(rest);
          res.status(200).json({
            status: 'success',
            msq: 'usuario logueado con éxito',
            user: rest,
            token
          });
        }
      } catch (error) {
        res.status(409).json({
          status: 'error',
          msg: 'Ha ocurrido un error al intentar loguear al usuario',
          error
        });
      }
    } else {
      res.status(400).json({
        msg: 'El formulario tiene errores en los campos',
        error: errors,
        returnData: req.body,
        status: 'bad request'
      });
    }
  },
  loginPassenger: async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const { pasajero } = req.contratoIndividual;
        const pasajeroMapped = pasajero.dataValues;
        const { created_at, updated_at, ...rest } = pasajeroMapped;
        const user = { ...rest, cod_contrato: req.body.cod_contrato, rol: { name: 'passenger' } };
        const token = jwt.sign(user);
        res.status(200).json({
          status: 'success',
          msq: 'Pasajero autenticado con éxito',
          user,
          token
        });
      } catch (error) {
        res.status(409).json({
          status: 'error',
          msg: 'Ha ocurrido un error al intentar autenticar al pasajero',
          error
        });
      }
    } else {
      res.status(400).json({
        msg: 'El formulario tiene errores en los campos',
        error: errors,
        returnData: req.body,
        status: 'bad request'
      });
    }
  }
};
