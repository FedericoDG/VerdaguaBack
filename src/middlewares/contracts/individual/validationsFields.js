const { check } = require('express-validator');

const validates = {
  //For common data
  validatesCreateForm: [
    /* check('fecha_contrato').notEmpty().withMessage('Este campo es requerido'),
    check('valor_contrato').notEmpty().withMessage('Este campo es requerido'),
    check('id_contrato_general').notEmpty().withMessage('Este campo es requerido'),
    check('id_pasajero').notEmpty().withMessage('Este campo es requerido') */
    check('id_contrato_general').notEmpty().withMessage('Este campo es requerido'),
    check('id_pasajero').notEmpty().withMessage('Este campo es requerido')
    // check('valor').notEmpty().withMessage('Este campo es requerido'),
    // check('cuotas').notEmpty().withMessage('Este campo es requerido'),
    // check('codigo_contrato_individual').notEmpty().withMessage('Este campo es requerido')
  ]
};

module.exports = validates;
