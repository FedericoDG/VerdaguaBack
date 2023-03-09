const { check } = require('express-validator');

const validates = {
  validatesCreateForm: [
    check('nombre').notEmpty().withMessage('Este campo es requerido'),
    check('apellido').notEmpty().withMessage('Este campo es requerido'),
    check('documento').notEmpty().withMessage('Este campo es requerido'),
    check('fecha_nac').notEmpty().withMessage('Este campo es requerido'),
    check('email').notEmpty().withMessage('Este campo es requerido').bail().isEmail().withMessage('email invalido'),
    check('telefono').notEmpty().withMessage('Este campo es requerido'),
    check('direccion').notEmpty().withMessage('Este campo es requerido'),
    check('ciudad').notEmpty().withMessage('Este campo es requerido'),
    check('provincia').notEmpty().withMessage('Este campo es requerido'),
    check('codigo_postal').notEmpty().withMessage('Este campo es requerido')
  ]
};

module.exports = validates;
