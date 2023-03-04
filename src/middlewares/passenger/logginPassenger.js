const { ContratoIndividual, Pasajero } = require('../../database/models');

module.exports = {
  PassengerExist: async (req, res, next) => {
    try {
      const { cod_contrato } = req.body;
      const { dataValues: contratoIndividual } = (await ContratoIndividual.findOne({
        where: {
          cod_contrato
        },
        include: [
          {
            model: Pasajero,
            as: 'pasajero'
          }
        ]
      })) || { dataValues: null };
      if (!contratoIndividual) {
        return res.status(404).json({
          status: 'not found',
          msg: 'El código de contrato no existe'
        });
      } else {
        req.contratoIndividual = contratoIndividual;
        next();
      }
    } catch (error) {
      res.status(409).json({
        status: 'error',
        msg: 'Ha ocurrido un error al intentar verificar el código de contrato'
      });
    }
  }
};
