const { Institucion } = require('../../database/models');

module.exports = {
  institutionExist: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { dataValues: institution } = (await Institucion.findOne({ where: { id } })) || { dataValues: null };
      if (!institution) {
        return res.status(404).json({
          status: 'not found',
          msg: 'La Institución no existe'
        });
      } else {
        req.institution = institution;
        next();
      }
    } catch (error) {
      res.status(409).json({
        status: 'error',
        msg: 'Ha ocurrido un error al intentar verificar la institución'
      });
    }
  },
  institutioAlreadyExist: async (req, res, next) => {
    try {
      const { nombre } = req.body;
      const { dataValues: institution } = (await Institucion.findOne({ where: { nombre } })) || { dataValues: null };
      if (!institution) {
        next();
      } else {
        res.status(409).json({
          staus: 'denied',
          msg: 'La institución ya existe o es inválida',
          returnData: req.body
        });
      }
    } catch (error) {
      res.status(409).json({
        status: 'error',
        msg: 'Ha ocurido un error al intentar verificar la institución'
      });
    }
  }
};
