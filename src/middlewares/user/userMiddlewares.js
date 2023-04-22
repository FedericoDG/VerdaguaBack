const { Rol, Usuario } = require('../../database/models');
const { Op } = require('sequelize');

module.exports = {
  userExist: async (req, res, next) => {
    try {
      const param = req.params.id || req.body.email;
      const { dataValues: user } = (await Usuario.findOne({
        where: {
          [Op.or]: [{ id: param }, { email: param }]
        },
        include: [
          {
            model: Rol,
            as: 'rol'
          }
        ]
      })) || { dataValues: null };
      if (!user) {
        return res.status(404).json({
          status: 'not found',
          msg: 'El usuario no existe'
        });
      } else {
        req.user = user;
        next();
      }
    } catch (error) {
      res.status(409).json({
        status: 'error',
        // msg: 'Ha ocurrido un error al intentar verificar el usuario'
        msg: error
      });
    }
  },
  userAlreadyExist: async (req, res, next) => {
    try {
      const { email } = req.body;
      const { dataValues: user } = (await Usuario.findOne({ where: { email } })) || { dataValues: null };
      if (!user) {
        next();
      } else {
        res.status(409).json({
          staus: 'denied',
          msg: 'El usuario ya existe o es inválido',
          returnData: req.body
        });
      }
    } catch (error) {
      res.status(409).json({
        status: 'error',
        msg: 'Ha ocurido un error al intentar verificar el usuario'
      });
    }
  }
};
