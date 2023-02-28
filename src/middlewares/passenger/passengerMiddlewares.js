const { ContratoIndividual, ContratoGeneral, Institucion, Pasajero, Responsable } = require('../../database/models');
const { SUPER } = require('../../constants/roles');

module.exports = {
  passengerExist: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { dataValues: passenger } = (await Pasajero.findOne({
        where: { id },
        include: [
          {
            model: Responsable,
            as: 'responsable'
          }
        ]
      })) || { dataValues: null };
      if (!passenger) {
        return res.status(404).json({
          status: 'not found',
          msg: 'El pasajero no existe'
        });
      }
      let individualContracts = await ContratoIndividual.findAll({
        where: { id_pasajero: passenger.id },
        include: [
          {
            model: ContratoGeneral,
            as: 'contrato_general',
            include: {
              model: Institucion,
              as: 'institucion'
            }
          }
        ]
      });
      if (req.user.rol.name !== SUPER) {
        const mapped = individualContracts.map((result) => result.dataValues);
        individualContracts = mapped.filter((el) => el.estado === 'vigente' || el.estado === 'pagado');
      }
      req.passenger = { ...passenger, contratos_individuales: [...individualContracts] };
      next();
    } catch (error) {
      res.status(409).json({
        status: 'error',
        msg: 'Ha ocurrido un error al intentar verificar el pasajero'
      });
    }
  },
  passengerAlreadyExist: async (req, res, next) => {
    try {
      const { documento } = req.body;
      const { dataValues: passenger } = (await Pasajero.findOne({ where: { documento } })) || { dataValues: null };
      if (!passenger) {
        next();
      } else {
        res.status(409).json({
          staus: 'denied',
          msg: 'El pasajero ya existe o es inválido',
          returnData: req.body
        });
      }
    } catch (error) {
      res.status(409).json({
        status: 'error',
        msg: 'Ha ocurido un error al intentar verificar el pasajero'
      });
    }
  },
  responsibleNotExist: async (req, res, next) => {
    try {
      const { documento_responsable } = req.body;
      if (!documento_responsable) {
        return next();
      }
      const { dataValues: responsible } = (await Responsable.findOne({ where: { documento: documento_responsable } })) || {
        dataValues: null
      };
      if (!responsible) {
        return res.status(409).json({
          staus: 'denied',
          msg: 'No existe un responsable con ese documento',
          returnData: req.body
        });
      }
      req.responsible_id = responsible.id;
      next();
    } catch (error) {
      res.status(409).json({
        status: 'error',
        msg: 'Ha ocurido un error al intentar verificar el pasajero'
      });
    }
  }
};
