const { check } = require('express-validator');

const validates = {
  //For common data
  validatesCreateForm: [
    check('nombre').notEmpty().withMessage('Este campo es requerido'),
    check('direccion').notEmpty().withMessage('Este campo es requerido'),
    check('telefono').notEmpty().withMessage('Este campo es requerido'),
    check('localidad').notEmpty().withMessage('Este campo es requerido')
  ]
};

module.exports = validates;
