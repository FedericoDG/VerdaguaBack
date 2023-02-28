const { ContratoIndividual, ContratoGeneral, Institucion, Cuota } = require('../../database/models');
const { SUPER } = require('../../constants/roles');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

module.exports = {
  get: async (req, res) => {
    try {
      let generalContracts = await ContratoGeneral.findAll({
        include: [
          {
            model: Institucion,
            as: 'institucion'
          }
        ],
        order: [['id', 'DESC']]
      });
      if (req.user.rol.name !== SUPER) {
        const mapped = generalContracts.map((result) => result.dataValues);
        generalContracts = mapped.filter((el) => el.estado === 'vigente' || el.estado === 'pagado');
      }
      res.status(200).json({
        status: 'success',
        count: generalContracts.length,
        data: generalContracts
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar recuperar los contratos generales',
        error,
        status: 'error'
      });
    }
  },
  getByQuery: async (req, res) => {
    try {
      const { cod_contrato } = req.query;
      const { name } = req.query;
      let generalContracts;
      if (cod_contrato) {
        generalContracts = await ContratoGeneral.findAll({
          where: { cod_contrato },
          include: [
            {
              model: Institucion,
              as: 'institucion'
            }
          ],
          order: [['id', 'DESC']]
        });
      }
      if (name) {
        const institutions = await Institucion.findAll({
          where: {
            nombre: {
              [Op.like]: `%${name}%`
            }
          },
          attributes: ['id'],
          order: [['id', 'DESC']]
        });

        const idInst = institutions.map((el) => el.id);
        generalContracts = (
          await Promise.all(
            idInst.map((el) =>
              ContratoGeneral.findAll({
                where: { id_institucion: el },
                include: [
                  {
                    model: Institucion,
                    as: 'institucion'
                  }
                ],
                order: [['id', 'DESC']]
              })
            )
          )
        ).flat();
      }
      if (req.user.rol.name !== SUPER) {
        const mapped = generalContracts.map((result) => result.dataValues);
        generalContracts = mapped.filter((el) => el.estado === 'vigente' || el.estado === 'pagado');
      }
      return res.status(200).json({
        status: 'success',
        msg: 'Contratos recuperados',
        count: generalContracts.length,
        data: generalContracts
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar recuperar los pasajeros',
        error,
        status: 'error'
      });
    }
  },
  getCodes: async (req, res) => {
    try {
      const { id } = req.query;
      let generalContracts = await ContratoGeneral.findAll({
        include: [
          {
            model: Institucion,
            as: 'institucion'
          }
        ],
        order: [['id', 'DESC']]
      });
      if (id) {
        const mapped = generalContracts.filter((el) => el.id == id);
        generalContracts = mapped;
      }
      /* if (req.user.rol.name !== SUPER) {
        const mapped = generalContracts.map((result) => result.dataValues);
        generalContracts = mapped.filter((el) => el.estado === 'vigente' || el.estado === 'pagado');
      } */
      const data = generalContracts
        .filter((el) => el.estado === 'vigente' || el.estado === 'pagado')
        .map((el) => ({
          label: `${el.cod_contrato} # ${el.institucion.nombre} - Grado:  ${el.grado} - División:  ${el.division} - Turno: ${el.turno} # (${el.descripcion})`,
          id: el.id
        }));
      res.status(200).json({
        status: 'success',
        count: generalContracts.length,
        data
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar recuperar los responsables',
        error,
        status: 'error'
      });
    }
  },
  getById: (req, res) => {
    res.status(200).json({
      status: 'success',
      msg: 'Contrato general encontrado',
      data: req.generalContract
    });
  },
  getByInstitutionId: async (req, res) => {
    const { id: id_institucion } = req.params;
    try {
      let generalContracts = await ContratoGeneral.findAll({
        where: { id_institucion },
        include: [
          {
            model: Institucion,
            as: 'institucion'
          }
        ],
        order: [['id', 'DESC']]
      });
      const GC = generalContracts.map((result) => result.dataValues);
      let data = await Promise.all(
        GC.map(async (el) => {
          const partial = await ContratoIndividual.findAll({ where: { id_contrato_general: el.id } });
          return {
            ...el,
            contratos_individuales: [...partial]
          };
        })
      );
      if (req.user.rol.name !== SUPER) {
        const mapped = data.filter((el) => el.estado === 'vigente' || el.estado === 'pagado');
        data = mapped.filter((el) => el.estado === 'vigente' || el.estado === 'pagado');
      }
      res.status(200).json({
        status: 'success',
        count: GC.length,
        data
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar recuperar los contratos generales........',
        error,
        status: 'error'
      });
    }
  },
  create: async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const generalContract = req.body;
        const { cod_contrato } = req;
        const now = new Date();
        await ContratoGeneral.create({ ...generalContract, asientos_ocupados: 0, fecha_contrato: now, cod_contrato });
        res.status(200).json({
          status: 'success',
          msg: 'Contrato general creado con éxito',
          cod_contrato
        });
      } catch (error) {
        res.status(409).json({
          status: 'error',
          msg: 'Ha ocurrido un error al intentar crear el contrato general',
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
        const generalContract = req.body;
        const { fecha_contrato, cod_contrato, estado, ...rest } = generalContract;
        const { id } = req.params;

        const individualContracts = await ContratoIndividual.findAll({
          where: { id_contrato_general: id },
          attributes: ['id', 'estado']
        });

        if (estado === 'cancelado') {
          const iContractsMapped = individualContracts.map((el) => el.dataValues);
          const valids = iContractsMapped.filter((el) => el.estado === 'vigente' || el.estado === 'pagado').map((el) => el.id);
          if (valids.length > 0) {
            let msg = `Imposible cancelar contrato. Hay ${valids.length} contrato individual vigente o pagado.`;
            if (valids.length > 1) msg = `Imposible cancelar contrato. Hay ${valids.length} contratos individuales vigentes o pagados.`;
            return res.status(400).json({
              status: 'error',
              valids,
              msg
            });
          }
        }
        if (estado === 'terminado') {
          const iContractsMapped = individualContracts.map((el) => el.dataValues);
          let valids = iContractsMapped.filter((el) => el.estado === 'vigente').map((el) => el.id);
          if (valids.length > 0) {
            return res.status(400).json({
              status: 'error',
              valids,
              msg: `Imposible terminar contrato, tiene contratos individuales vigentes.`
            });
          }
          // TODO: tomar todos los contratos PAGADOS y pasarlos a TERMINADOS
          valids = iContractsMapped.filter((el) => el.estado === 'pagado').map((el) => el.id);
          await Promise.all(valids.map(async (el) => await ContratoIndividual.update({ estado: 'terminado' }, { where: { id: el } })));
        }
        await ContratoGeneral.update({ estado, ...rest }, { where: { id } });
        res.status(200).json({
          status: 'success',
          msg: 'Contrato general editado con éxito'
        });
      } catch (error) {
        res.status(409).json({
          status: 'error',
          msg: 'Ha ocurrido un error al intentar editar el contrato general',
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

      const individuals = await ContratoIndividual.findAll({ where: { id_contrato_general: id }, attributes: ['id'] });
      await Promise.all(individuals.map(async (el) => await ContratoIndividual.destroy({ where: { id: el.id } })));

      await ContratoGeneral.destroy({ where: { id } });

      res.status(200).json({
        status: 'success',
        msg: 'Contrato general borrado con éxito'
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar borrar el contrato general',
        error,
        status: 'error'
      });
    }
  }
};
