const { check } = require('express-validator');

const validates = {
  validatesCreateForm: [
    check('nombre').notEmpty().withMessage('Este campo es requerido'),
    check('apellido').notEmpty().withMessage('Este campo es requerido'),
    check('documento').notEmpty().withMessage('Este campo es requerido'),
    check('fecha_nac').notEmpty().withMessage('Este campo es requerido'),
    check('obs_medicas').optional({ nullable: true }),
    check('id_responsable').optional({ nullable: true })
  ]
};

module.exports = validates;
