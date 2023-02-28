const { Institucion } = require('../database/models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

module.exports = {
  get: async (req, res) => {
    try {
      let institutions = await Institucion.findAll({
        order: [['id', 'DESC']]
      });
      res.status(200).json({
        status: 'success',
        count: institutions.length,
        data: institutions
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar recuperar las instituciones',
        error,
        status: 'error'
      });
    }
  },
  getById: (req, res) => {
    res.status(200).json({
      status: 'success',
      msg: 'Institución encontrada',
      data: req.institution
    });
  },
  getCodes: async (req, res) => {
    try {
      const institutions = await Institucion.findAll({
        attributes: ['id', 'nombre', 'direccion', 'localidad'],
        order: [['id', 'DESC']]
      });
      const data = institutions.map((el) => ({ label: `${el.nombre} - ${el.direccion}, ${el.localidad}`, id: el.id }));
      res.status(200).json({
        status: 'success',
        count: institutions.length,
        data
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar recuperar las instituciones',
        error,
        status: 'error'
      });
    }
  },
  getByQuery: async (req, res) => {
    try {
      const { name } = req.query;
      let institutions;
      if (name) {
        institutions = await Institucion.findAll({
          where: {
            nombre: {
              [Op.like]: `%${name}%`
            }
          },
          order: [['id', 'DESC']]
        });
      }
      return res.status(200).json({
        status: 'success',
        msg: 'Instituciones recuperadas',
        count: institutions.length,
        data: institutions
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar recuperar las instituciones',
        error,
        status: 'error'
      });
    }
  },
  create: async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const institution = req.body;
        await Institucion.create(institution);
        res.status(200).json({
          status: 'success',
          msg: 'Institucion creada con éxito'
        });
      } catch (error) {
        res.status(409).json({
          status: 'error',
          msg: 'Ha ocurrido un error al intentar crear la institución',
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
  },
  edit: async (req, res) => {
    const errors = validationResult(req);
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
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Institucion.destroy({ where: { id } });
      res.status(200).json({
        status: 'success',
        msg: 'Institución borrada con éxito'
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar borrar la institución',
        error,
        status: 'error'
      });
    }
  }
};
