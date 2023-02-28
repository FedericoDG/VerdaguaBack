const { Op } = require('sequelize');
const { Pasajero, Responsable } = require('../database/models');
const { validationResult } = require('express-validator');

module.exports = {
  get: async (req, res) => {
    try {
      const passengers = await Pasajero.findAll({
        include: [
          {
            model: Responsable,
            as: 'responsable'
          }
        ],
        order: [['id', 'DESC']]
      });
      res.status(200).json({
        status: 'success',
        count: passengers.length,
        data: passengers
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar traer los pasajeros',
        error,
        status: 'error'
      });
    }
  },
  getByResponsible: async (req, res) => {
    try {
      const { id } = req.params;
      const passengers = await Pasajero.findAll({
        where: { id_responsable: id },

        order: [['id', 'DESC']]
      });
      res.status(200).json({
        status: 'success',
        count: passengers.length,
        data: passengers
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar traer los pasajeros',
        error,
        status: 'error'
      });
    }
  },
  getCodes: async (req, res) => {
    try {
      const passengers = await Pasajero.findAll({
        where: {
          id_responsable: {
            [Op.not]: null
          }
        },
        attributes: ['id', 'apellido', 'nombre', 'documento'],
        order: [['id', 'DESC']]
      });
      const data = passengers.map((el) => ({ label: `${el.documento} - ${el.apellido}, ${el.nombre}`, id: el.id }));
      res.status(200).json({
        status: 'success',
        count: passengers.length,
        data
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar recuperar los pasajeros',
        error,
        status: 'error'
      });
    }
  },
  getById: async (req, res) => {
    res.status(200).json({
      status: 'success',
      msg: 'Pasajero encontrado',
      data: req.passenger
    });
  },
  getByQuery: async (req, res) => {
    try {
      const { documento } = req.query;
      const { apellido } = req.query;
      let passengers;
      if (documento) {
        passengers = await Pasajero.findAll({
          where: {
            documento: {
              [Op.like]: `%${documento}%`
            }
          },
          include: [
            {
              model: Responsable,
              as: 'responsable'
            }
          ],
          order: [['id', 'DESC']]
        });
      }
      if (apellido) {
        passengers = await Pasajero.findAll({
          where: {
            apellido: {
              [Op.like]: `%${apellido}%`
            }
          },
          include: [
            {
              model: Responsable,
              as: 'responsable'
            }
          ],
          order: [['id', 'DESC']]
        });
      }
      return res.status(200).json({
        status: 'success',
        msg: 'Pasajeros recuperados',
        count: passengers.length,
        data: passengers
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar recuperar los pasajeros',
        error,
        status: 'error'
      });
    }
  },
  create: async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const passenger = req.body;
        const responsibleId = req.responsible_id || null;
        await Pasajero.create({ ...passenger, id_responsable: responsibleId });
        res.status(200).json({
          status: 'success',
          msg: 'Pasajero creado con éxito'
        });
      } catch (error) {
        res.status(409).json({
          status: 'error',
          msg: 'Ha ocurrido un error al intentar crear el pasajero',
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
        const passenger = req.body;
        const { id } = req.params;
        if (req.body.documento_responsable) {
          const responsible = await Responsable.findOne({ where: { documento: req.body.documento_responsable }, attributes: ['id'] });
          await Pasajero.update({ ...passenger, id_responsable: responsible.id }, { where: { id } });
        } else {
          await Pasajero.update({ ...passenger }, { where: { id } });
        }
        res.status(200).json({
          status: 'success',
          msg: 'Pasajero editado con éxito'
        });
      } catch (error) {
        res.status(409).json({
          status: 'error',
          msg: 'Ha ocurrido un error al intentar editar el pasajero',
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
      await Pasajero.destroy({ where: { id } });
      res.status(200).json({
        status: 'success',
        msg: 'Pasajero borrado con éxito'
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar borrar el pasajero',
        error,
        status: 'error'
      });
    }
  }
};
