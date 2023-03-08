const { ContratoGeneral, ContratoIndividual, Institucion, Pasajero, Responsable } = require('../../../database/models');
const { SUPER } = require('../../../constants/roles');
const randomCode = require('../../../helpers/randomCode');

module.exports = {
  generalContractExist: async (req, res, next) => {
    try {
      const { id } = req.params;
      let { dataValues: generalContract } = (await ContratoGeneral.findOne({
        where: { id },
        include: [
          {
            model: Institucion,
            as: 'institucion'
          }
        ]
      })) || { dataValues: null };
      if (!generalContract) {
        return res.status(404).json({
          status: 'not found',
          msg: 'El contrato general no existe'
        });
      }
      if (req.user.rol.name !== SUPER && generalContract.estado !== 'vigente') {
        return res.status(404).json({
          status: 'not found',
          msg: 'El contrato general no existe'
        });
      }
      let individualContracts = await ContratoIndividual.findAll({
        where: { id_contrato_general: generalContract.id },
        include: [
          {
            model: Pasajero,
            as: 'pasajero',
            include: {
              model: Responsable,
              as: 'responsable'
            }
          }
        ]
      });
      if (req.user.rol.name !== SUPER) {
        const mapped = individualContracts.map((el) => el.dataValues);
        individualContracts = mapped.filter((el) => el.estado === 'vigente' || el.estado === 'pagado');
      }

      req.generalContract = { ...generalContract, contratos_individuales: [...individualContracts] };
      next();
    } catch (error) {
      res.status(409).json({
        status: 'error',
        msg: 'Ha ocurrido un error al intentar verificar el contrato general'
      });
    }
  },
  generalContractAlreadyExist: async (req, res, next) => {
    try {
      const cod_contrato = randomCode();
      /* 
      TODO: Verificar que el código no está repetido
      */
      const { dataValues: generalContract } = (await ContratoGeneral.findOne({ where: { cod_contrato } })) || { dataValues: null };
      if (!generalContract) {
        req.cod_contrato = cod_contrato;
        next();
      } else {
        res.status(409).json({
          staus: 'denied',
          msg: 'El contrato general ya existe o es inválido',
          returnData: req.body
        });
      }
    } catch (error) {
      res.status(409).json({
        status: 'error',
        msg: 'Ha ocurido un error al intentar verificar el contrato general'
      });
    }
  }
};
