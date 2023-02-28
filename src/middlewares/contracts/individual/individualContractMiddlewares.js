const { ContratoIndividual, ContratoGeneral, Institucion, Pasajero } = require('../../../database/models');

module.exports = {
  individualContractExist: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { dataValues: individualContract } = (await ContratoIndividual.findOne({
        where: { id },
        include: [
          {
            model: ContratoGeneral,
            as: 'contrato_general',
            include: {
              model: Institucion,
              as: 'institucion'
            }
          },
          {
            model: Pasajero,
            as: 'pasajero'
          }
        ]
      })) || { dataValues: null };
      if (!individualContract) {
        return res.status(404).json({
          status: 'not found',
          msg: 'El contrato individual no existe'
        });
      } else {
        req.individualContract = individualContract;
        next();
      }
    } catch (error) {
      res.status(409).json({
        status: 'error',
        msg: 'Ha ocurrido un error al intentar verificar el contrato individual'
      });
    }
  },
  individualContractAlreadyExist: async (req, res, next) => {
    try {
      const { id } = req.body;
      const { dataValues: individualContract } = (await ContratoIndividual.findOne({ where: { id } })) || { dataValues: null };
      if (!individualContract) {
        next();
      } else {
        res.status(409).json({
          staus: 'denied',
          msg: 'El contrato individual ya existe o es inválido',
          returnData: req.body
        });
      }
    } catch (error) {
      res.status(409).json({
        status: 'error',
        msg: 'Ha ocurido un error al intentar verificar el contrato individual'
      });
    }
  }
};
