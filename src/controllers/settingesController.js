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
        msg: 'Parámetros recuperados con éxito',
        data: settings
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar recuperar los parámetros',
        error,
        status: 'error'
      });
    }
  },
  getTicket: async (_, res) => {
    try {
      const data = await Parametro.findByPk(1, {
        attributes: ['ticket'],
        order: [['id', 'DESC']]
      });
      res.status(200).json({
        status: 'success',
        msg: 'Parámetros recuperados con éxito',
        data
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar recuperar los parámetros',
        error,
        status: 'error'
      });
    }
  },
  edit: async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        await Parametro.update({ ...req.body }, { where: { id: 1 } });
        res.status(200).json({
          status: 'success',
          msg: 'Parámetros editados con éxito.'
        });
      } catch (error) {
        res.status(409).json({
          status: 'error',
          msg: 'Ha ocurrido un error al intentar editar los parámetros',
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
    }
  }
};
