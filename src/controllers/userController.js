const { Op } = require('sequelize');
const { SUPER } = require('../constants/roles');
const { Usuario, Rol } = require('../database/models');
const { validationResult } = require('express-validator');
const bcrypt = require('../helpers/bcrypt');

module.exports = {
  get: async (req, res) => {
    try {
      let query = {};
      if (req.user.rol.name !== SUPER) {
        query = {
          id_rol: {
            [Op.not]: 1
          }
        };
      }
      const listUsers = await Usuario.findAll({
        where: query,
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Rol,
            as: 'rol'
          }
        ],
        order: [['id', 'DESC']]
      });
      res.status(200).json({
        status: 'success',
        count: listUsers.length,
        data: listUsers
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar recuperar los usuarios',
        error,
        status: 'error'
      });
    }
  },
  getById: (req, res) => {
    res.status(200).json({
      status: 'success',
      msg: 'Usuario encontrado',
      data: req.user,
      token: req.token
    });
  },
  create: async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const user = req.body;
        const { password } = user;
        const hashPassword = await bcrypt.hash(password);
        await Usuario.create({
          ...user,
          password: hashPassword
        });
        res.status(200).json({
          status: 'success',
          msg: 'Usuario creado con éxito'
        });
      } catch (error) {
        res.status(409).json({
          status: 'error',
          msg: 'Ha ocurrido un error al intentar crear el usuario',
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
        const user = req.body;
        const { id } = req.params;
        const hasshedPassword = await bcrypt.hash(req.body.password);
        const updatedUser = await Usuario.update({ ...user, password: hasshedPassword }, { where: { id } });
        res.status(200).json({
          status: 'success',
          msg: 'Usuario editado con éxito',
          data: updatedUser
        });
      } catch (error) {
        res.status(409).json({
          status: 'error',
          msg: 'Ha ocurrido un error al intentar editar el usuario',
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
  editPass: async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const { id } = req.params;
        const { password } = req.body;
        await Usuario.update(
          {
            password: await bcrypt.hash(password)
          },
          {
            where: { id }
          }
        );
        res.status(200).json({
          status: 'success',
          msg: 'La contraseña se cambio con éxito'
        });
      } catch (error) {
        res.status(409).json({
          status: 'error',
          msg: 'Ha ocurrido un error al intentar cambiar la contraseña',
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
      await Usuario.destroy({ where: { id } });
      res.status(200).json({
        msg: 'Usuario borrado con éxito',
        status: 'success'
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar borrar el usuario',
        error,
        status: 'error'
      });
    }
  }
};
