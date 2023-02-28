const { Parametro } = require('../database/models');
const { validationResult } = require('express-validator');

module.exports = {
  get: async (_, res) => {
    try {
      const settings = await Parametro.findByPk(1, {
        order: [['id', 'DESC']]
      });
      res.status(200).json({
        status: 'success',
        data: settings
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar recuperar los par',
        error,
        status: 'error'
      });
    }
  },
  edit: async (req, res) => {
    /* const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const institution = req.body;
        const { id } = req.params;
        await Institucion.update({ ...institution }, { where: { id } });
        res.status(200).json({
          status: 'success',
          msg: 'Institución editada con éxito'
        });
      } catch (error) {
        res.status(409).json({
          status: 'error',
          msg: 'Ha ocurrido un error al intentar editar la institución',
          error
        });
      }
    } else {
      res.status(400).json({
        status: 'bad request',
        msg: 'El formulario tiene errores en los campos',
        error: errors,
        returnData: req.body
      });
    } */
  }
};
