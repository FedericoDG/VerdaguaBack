const { validationResult } = require('express-validator');
const bcrypt = require('../helpers/bcrypt');
const jwt = require('../helpers/jwt');

module.exports = {
  login: async (req, res) => {
    //form fields validations
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      //validations without errors
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
          //creates security token
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
      //validations with errors
      res.status(400).json({
        msg: 'El formulario tiene errores en los campos',
        error: errors,
        returnData: req.body,
        status: 'bad request'
      });
    }
  }
  /* checkToken: (req, res) => {
    const { nombre, apellido, email, id_rol } = req.user;
    const { token } = req;
    res.status(200).json({
      msg: 'El token es invalido',
      user: { nombre, apellido, email, id_rol },
      token: token,
      status: 'success'
    });
  } */
};
