const { check } = require('express-validator');

const validates = {
  validatesCreateForm: [
    check('descripcion').notEmpty().withMessage('Este campo es requerido'),
    check('valor_contrato').notEmpty().withMessage('Este campo es requerido'),
    check('fecha_viaje').notEmpty().withMessage('Este campo es requerido'),
    check('asientos_totales').notEmpty().withMessage('Este campo es requerido'),
    check('grado').notEmpty().withMessage('Este campo es requerido'),
    check('division').notEmpty().withMessage('Este campo es requerido'),
    check('turno').notEmpty().withMessage('Este campo es requerido'),
    check('id_institucion').optional({ nullable: true })
  ]
};

module.exports = validates;
