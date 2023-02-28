const { Op } = require('sequelize');
const { Rol } = require('../database/models');
const { SUPER } = require('../constants/roles');

module.exports = {
  get: async (req, res) => {
    try {
      let query = {};
      if (req.user.rol.name !== SUPER) {
        query = {
          name: {
            [Op.not]: SUPER
          }
        };
      }
      const roles = await Rol.findAll({ where: query });
      res.status(200).json({
        status: 'success',
        count: roles.length,
        data: roles
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar traer los roles',
        error,
        status: 'error'
      });
    }
  },
  create: async (req, res) => {
    try {
      const { rol, descripcion } = req.body;
      const { dataValues: newRole } = await Rol.create({
        rol,
        descripcion
      });
      res.status(200).json({
        msg: 'Rol creado con éxito',
        data: newRole,
        status: 'success'
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar crear el rol',
        error,
        status: 'error'
      });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await Rol.destroy({ where: { id } });
      res.status(200).json({
        msg: 'Rol borrado con éxito',
        status: 'success'
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar borar el rol',
        error,
        status: 'error'
      });
    }
  }
};
