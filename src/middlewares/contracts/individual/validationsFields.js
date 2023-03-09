const { check } = require('express-validator');

const validates = {
  validatesCreateForm: [
    check('id_contrato_general').notEmpty().withMessage('Este campo es requerido'),
    check('id_pasajero').notEmpty().withMessage('Este campo es requerido')
  ]
};

module.exports = validates;
