const { ContratoIndividual, Pasajero } = require('../../database/models');
const { Op } = require('sequelize');

module.exports = {
  PassengerExist: async (req, res, next) => {
    try {
      let { cod_contrato } = req.body;
      const { dataValues: contratoIndividual } = (await ContratoIndividual.findOne({
        where: {
          cod_contrato: {
            [Op.like]: `%${cod_contrato}%`
          },
          estado: {
            [Op.or]: ['vigente', 'pagado']
          }
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
          msg: 'El número de cocumento no existe existe'
        });
      } else {
        req.contratoIndividual = contratoIndividual;
        next();
      }
    } catch (error) {
      res.status(409).json({
        status: 'error',
        msg: 'Ha ocurrido un error al intentar verificar el número de documento'
      });
    }
  }
};
