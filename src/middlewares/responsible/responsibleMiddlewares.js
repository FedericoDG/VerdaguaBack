const { Responsable } = require('../../database/models');

module.exports = {
  responsibleExist: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { dataValues: responsible } = (await Responsable.findOne({ where: { id } })) || { dataValues: null };
      if (!responsible) {
        return res.status(404).json({
          status: 'not found',
          msg: 'El responsable no existe'
        });
      } else {
        req.responsible = responsible;
        next();
      }
    } catch (error) {
      res.status(409).json({
        status: 'error',
        msg: 'Ha ocurrido un error al intentar verificar el responsable'
      });
    }
  },
  responsibleAlreadyExist: async (req, res, next) => {
    try {
      const { documento } = req.body;
      const { dataValues: responsible } = (await Responsable.findOne({ where: { documento } })) || { dataValues: null };
      if (!responsible) {
        next();
      } else {
        res.status(409).json({
          staus: 'denied',
          msg: 'El responsable ya existe o es inválido',
          returnData: req.body
        });
      }
    } catch (error) {
      res.status(409).json({
        status: 'error',
        msg: 'Ha ocurido un error al intentar verificar el responsable'
      });
    }
  }
};
