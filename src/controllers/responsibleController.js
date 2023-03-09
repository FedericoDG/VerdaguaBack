const { Op } = require('sequelize');
const { Responsable } = require('../database/models');
const { validationResult } = require('express-validator');

module.exports = {
  get: async (req, res) => {
    try {
      const responsibles = await Responsable.findAll({
        order: [['id', 'DESC']]
      });
      res.status(200).json({
        status: 'success',
        count: responsibles.length,
        data: responsibles
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar recuperar los responsables',
        error,
        status: 'error'
      });
    }
  },
  getDocuments: async (req, res) => {
    try {
      const responsibles = await Responsable.findAll({
        attributes: ['documento', 'apellido', 'nombre'],
        order: [['id', 'DESC']]
      });

      const data = responsibles.map((el) => ({ label: `${el.documento} - ${el.apellido}, ${el.nombre}`, id: el.documento }));

      res.status(200).json({
        status: 'success',
        count: responsibles.length,
        data
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar recuperar los responsables',
        error,
        status: 'error'
      });
    }
  },
  getById: (req, res) => {
    res.status(200).json({
      status: 'success',
      msg: 'Responsable encontrado',
      data: req.responsible
    });
  },
  getByQuery: async (req, res) => {
    try {
      const { documento } = req.query;
      const { apellido } = req.query;
      let responsibles;
      if (documento) {
        responsibles = await Responsable.findAll({
          where: {
            documento: {
              [Op.like]: `%${documento}%`
            }
          },
          order: [['id', 'DESC']]
        });
      }
      if (apellido) {
        responsibles = await Responsable.findAll({
          where: {
            apellido: {
              [Op.like]: `%${apellido}%`
            }
          },
          order: [['id', 'DESC']]
        });
      }
      return res.status(200).json({
        status: 'success',
        msg: 'Resposables recuperados',
        count: responsibles.length,
        data: responsibles
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar recuperar los responsables',
        error,
        status: 'error'
      });
    }
  },
  create: async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const responsible = req.body;
        await Responsable.create(responsible);
        res.status(200).json({
          status: 'success',
          msg: 'Responsable creado con éxito'
        });
      } catch (error) {
        res.status(409).json({
          status: 'error',
          msg: 'Ha ocurrido un error al intentar crear el responsable',
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
        const responsible = req.body;
        const { id } = req.params;
        await Responsable.update({ ...responsible }, { where: { id } });
        res.status(200).json({
          status: 'success',
          msg: 'Responsable editado con éxito'
        });
      } catch (error) {
        res.status(409).json({
          status: 'error',
          msg: 'Ha ocurrido un error al intentar editar el responsable',
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
      await Responsable.destroy({ where: { id } });
      res.status(200).json({
        status: 'success',
        msg: 'Responsable borrado con éxito'
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar borrar el responsable',
        error,
        status: 'error'
      });
    }
  }
};
