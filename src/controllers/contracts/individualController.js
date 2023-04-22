const {
  ContratoIndividual,
  ContratoGeneral,
  Institucion,
  Pasajero,
  Parametro,
  Cuota,
  Movimiento,
  Responsable
} = require('../../database/models');
const { literal, Op } = require('sequelize');
const { SUPER } = require('../../constants/roles');
const { validationResult } = require('express-validator');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = {
  get: async (req, res) => {
    try {
      let individualContracts = await ContratoIndividual.findAll({
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
            as: 'pasajero',
            include: {
              model: Responsable,
              as: 'responsable'
            }
          }
        ],
        order: [['id', 'DESC']]
      });
      if (req.user.rol.name !== SUPER) {
        const mapped = individualContracts?.map((result) => result.dataValues);
        individualContracts = mapped?.filter((el) => el.estado === 'vigente' || el.estado === 'pagado' || el.estado === 'cancelado');
      }
      res.status(200).json({
        status: 'success',
        count: individualContracts?.length,
        data: individualContracts || []
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar recuperar los contratos individuales',
        error,
        status: 'error'
      });
    }
  },
  getCodes: async (req, res) => {
    try {
      const { id } = req.query;
      let individualContracts = await ContratoIndividual.findAll({
        include: [
          {
            model: Pasajero,
            as: 'pasajero'
          },
          {
            model: ContratoGeneral,
            as: 'contrato_general',
            include: [
              {
                model: Institucion,
                as: 'institucion'
              }
            ]
          }
        ],
        order: [['id', 'DESC']]
      });
      if (id) {
        const mapped = individualContracts.filter((el) => el.id == id);
        individualContracts = mapped;
      }
      const data = individualContracts
        .filter((el) => el.estado === 'vigente' /* || el.estado === 'pagado' */)
        .map((el) => ({
          label: `${el.pasajero.documento} - ${el.pasajero.apellido}, ${el.pasajero.nombre} # ${el.contrato_general.institucion.nombre} - Grado: ${el.contrato_general.grado} - División: ${el.contrato_general.division} - Turno:  ${el.contrato_general.turno} # (${el.contrato_general.descripcion})`,
          id: el.id
        }));
      res.status(200).json({
        status: 'success',
        count: individualContracts.length,
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
  getByQuery: async (req, res) => {
    try {
      const { code, document, list, lastname } = req.query;
      let individualContracts;

      if (code) {
        individualContracts = await ContratoIndividual.findAll({
          where: {
            cod_contrato: {
              [Op.like]: `%${code}%`
            }
          },
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
              as: 'pasajero',
              include: {
                model: Responsable,
                as: 'responsable'
              }
            }
          ],
          order: [['id', 'DESC']]
        });
      }

      if (document) {
        await sleep(3000);
        individualContracts = await ContratoIndividual.findAll({
          where: {
            cod_contrato: {
              [Op.like]: `%${document}%`
            }
          },
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
              as: 'pasajero',
              include: {
                model: Responsable,
                as: 'responsable'
              }
            }
          ],
          order: [['id', 'DESC']]
        });
      }

      if (lastname) {
        const passengers = await Pasajero.findAll({
          where: {
            apellido: {
              [Op.like]: `%${lastname}%`
            }
          },
          attributes: ['id'],
          order: [['id', 'DESC']]
        });

        individualContracts = await Promise.all(
          passengers.map(
            async (el) =>
              await ContratoIndividual.findAll({
                where: {
                  id_pasajero: el.id
                },
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
                    as: 'pasajero',
                    include: {
                      model: Responsable,
                      as: 'responsable'
                    }
                  }
                ],
                order: [['id', 'DESC']]
              })
          )
        );
        individualContracts = individualContracts.flat();
      }
      if (list) {
        const parsedList = JSON.parse(list);
        individualContracts = await Promise.all(
          parsedList.map(
            async (el) =>
              await ContratoIndividual.findOne({
                where: { id: el },
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
                ],
                order: [['id', 'DESC']]
              })
          )
        );
      }
      if (req.user.rol.name !== SUPER) {
        const mapped = individualContracts?.map((result) => result.dataValues);
        individualContracts = mapped?.filter((el) => el.estado === 'vigente' || el.estado === 'pagado' || el.estado === 'cancelado');
      }
      return res.status(200).json({
        status: 'success',
        msg: 'Contratos recuperados',
        count: individualContracts?.length,
        data: individualContracts || []
      });
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar recuperar los contratos',
        error,
        status: 'error'
      });
    }
  },
  recalculate: async (req, res) => {
    try {
      const { id } = req.params;
      let { nuevo_valor } = req.body;
      nuevo_valor = Number(nuevo_valor);

      const contratoIndividual = await ContratoIndividual.findByPk(id);
      const { valor_contrato } = contratoIndividual;
      const diferencia_precio = Number(nuevo_valor) - Number(valor_contrato);

      const seniaYCuotas = await Cuota.findAll({
        where: {
          id_contrato_individual: id
        },
        attributes: ['id', 'valor_primer_vencimiento', 'valor_segundo_vencimiento', 'estado', 'numero']
      });

      const parametros = await Parametro.findOne({
        where: {
          id: 1
        },
        attributes: ['porcentaje_recargo_segundo_vencimiento']
      });

      const porcentajeRecargo = parametros.porcentaje_recargo_segundo_vencimiento;

      const senia = seniaYCuotas.find((el) => el.numero === 0);
      const totalSenia = Number(senia.valor_primer_vencimiento);

      const cuotasPagadas = seniaYCuotas.filter((el) => el.numero !== 0 && el.estado === 'pagada');
      const cantidadCuotasPagadas = cuotasPagadas.length;
      const cuotasPendientes = seniaYCuotas.filter((el) => el.numero !== 0 && el.estado !== 'pagada');
      const cantidadCuotasPendientes = cuotasPendientes.length;

      const totalCuotasPagadas = cuotasPagadas[0]?.valor_primer_vencimiento * cantidadCuotasPagadas;
      const totalCuotasPendientes = cuotasPendientes[0].valor_primer_vencimiento * cantidadCuotasPendientes;

      const cuotasRecalculadas = cuotasPendientes
        .map((el) => el.dataValues)
        .map((cuota) => {
          const primerVencimiento = Number(cuota.valor_primer_vencimiento) + Number(diferencia_precio) / Number(cantidadCuotasPendientes);
          return {
            ...cuota,
            valor_primer_vencimiento: primerVencimiento,
            valor_segundo_vencimiento: primerVencimiento + (primerVencimiento * porcentajeRecargo) / 100
          };
        });

      res.status(200).json({
        a: id,
        status: 'success',
        msg: 'Cuotas recalculadas',
        diferencia_precio,
        totalSenia,
        totalCuotasPagadas,
        totalCuotasPagadas,
        totalCuotasPendientes,
        cantidadCuotasPendientes,
        cuotasRecalculadas,
        cuotasPagadas,
        senia,
        newContractValue: nuevo_valor,
        data: {
          cuotasPendientes,
          diferencia_precio,
          contratoIndividual
        }
      });
    } catch (error) {
      res.status(409).json({
        status: 'error',
        msg: 'Ha ocurrido un error al intentar recalcular las cuotas de un contrato individual',
        error
      });
    }
  },
  newShares: async (req, res) => {
    try {
      let { id } = req.params;
      let { shares, newContractValue } = req.body;
      await ContratoIndividual.update({ valor_contrato: newContractValue }, { where: { id } });
      await Promise.all(shares.map((el) => Cuota.update({ ...el }, { where: { id: el.id } })));
      res.status(200).json({
        status: 'success',
        msg: 'Nuevas cuotas actualizadas. Nuevo valor del Contrato Individual:' + '$ ' + newContractValue,
        shares
      });
    } catch (error) {
      res.status(409).json({
        status: 'error',
        msg: 'Ha ocurrido un error al intentar recalcular las cuotas de un contrato individual',
        error
      });
    }
  },
  getById: (req, res) => {
    res.status(200).json({
      status: 'success',
      msg: 'Contrato individual encontrado',
      data: req.individualContract
    });
  },
  installments: async (req, res) => {
    await sleep(3000);
    const { id } = req.params;
    const seniaYCuotas = await Cuota.findAll({
      where: {
        id_contrato_individual: id
      },
      include: [
        {
          model: ContratoIndividual,
          as: 'contrato_individual',
          include: [
            {
              model: Pasajero,
              as: 'pasajero',
              include: [
                {
                  model: Responsable,
                  as: 'responsable'
                }
              ]
            }
          ]
        },
        {
          model: Movimiento,
          as: 'movimiento'
        }
      ],
      order: [['numero', 'ASC']]
    });
    res.status(200).json({
      status: 'success',
      msg: 'Listado de cuotas',
      data: seniaYCuotas
    });
  },
  create: async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      /* try { */
      const { id_contrato_general, id_pasajero, valor, cuotas, codigo_contrato_individual } = req.body;

      const individualContractExist = await ContratoIndividual.findOne({ where: { cod_contrato: codigo_contrato_individual } });

      // Verifica que no exita un contrato para este pasajero
      if (individualContractExist) {
        return res.status(400).json({
          status: 'success',
          msg: 'Ya existe un Contrato Individual para este pasajero. Es posible que exista como cancelado.'
        });
      }

      // Verifica si es o no un pasajero liberado
      let individualContract;

      if (cuotas.length > 7) {
        individualContract = await ContratoIndividual.create({
          id_contrato_general: id_contrato_general,
          id_pasajero: id_pasajero,
          cod_contrato: codigo_contrato_individual,
          valor_contrato: 0,
          pagos: 0,
          recargos_pagos_segundo_vencimiento: 0,
          estado: 'pagado'
        });
      } else {
        individualContract = await ContratoIndividual.create({
          id_contrato_general: id_contrato_general,
          id_pasajero: id_pasajero,
          cod_contrato: codigo_contrato_individual,
          valor_contrato: valor,
          pagos: 0,
          recargos_pagos_segundo_vencimiento: 0,
          estado: 'vigente'
        });

        // Le agrega a las cuotas el id del Contrato Individual
        const cuotasConId = cuotas.map((el) => ({ ...el, id_contrato_individual: individualContract.id }));

        await Promise.all(cuotasConId.map(async (share) => Cuota.create({ ...share })));
      }

      // Actualiza en número de asientos ocupado en el Contrato General
      await ContratoGeneral.update({ asientos_ocupados: literal('asientos_ocupados + 1') }, { where: { id: id_contrato_general } });
      // ContratoGeneral.increment('seq', { by: 1, where: { id: id_contrato_general }});

      if (cuotas.length > 7) {
        return res.status(200).json({
          status: 'success',
          msg: 'Contrato individual creado con éxito. Redireccionando',
          data: {
            codigo: individualContract.cod_contrato,
            id: individualContract.id
          }
        });
      }

      res.status(200).json({
        status: 'success',
        msg: 'Contrato individual creado con éxito. Redireccionando a pagos',
        data: {
          codigo: individualContract.cod_contrato,
          id: individualContract.id,
          redirectToPay: 'true'
        }
      });
      /*  } catch (error) {
        res.status(409).json({
          status: 'error',
          msg: 'Ha ocurrido un error al intentar crear el contrato individual',
          error
        });
      } */
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
        const { user } = req;
        const { estado } = req.body;
        const { id } = req.params;
        const { individualContract } = req;
        if (estado === 'cancelado') {
          if (individualContract.estado === 'terminado') {
            // Eliminicación de todas las cuotas
            await Cuota.destroy({ where: { id_contrato_individual: id } });

            // Acualización del estado del contrato individual
            await ContratoIndividual.update({ estado }, { where: { id } });

            return res.status(200).json({
              status: 'success',
              msg: `Se eliminaron todas las cuotas asociadas. CONSIDERE ELIMINAR EL CONTRATO`
            });
          }

          // Obtención de todas las cuotas asociadas al Contrato Individual que será borrado
          const installments = await Cuota.findAll({
            where: { id_contrato_individual: id, numero: { [Op.not]: 0 }, estado: 'pagada' },
            attributes: ['id', 'valor_primer_vencimiento']
          });

          // Calculo del total a devolver
          const total_return = installments.reduce((acc, el) => acc + Number(el.valor_primer_vencimiento), 0) * -1;

          // Inserción del movimiento(egreso)
          if (Number(total_return) !== 0) {
            await Movimiento.create({
              importe: total_return,
              tipo: 'egreso',
              forma_pago: 'egreso',
              info: `Devolución de cuotas por eliminación de Contrato Individual ${individualContract.cod_contrato}`,
              id_usuario: user.id
            });
          }

          // Eliminicación de todas las cuotas
          await Cuota.destroy({ where: { id_contrato_individual: id } });

          // Acualización del estado del contrato individual
          await ContratoIndividual.update({ estado }, { where: { id } });

          // Actualización del lo asientos ocupados del contrato general
          const generalContract = await ContratoGeneral.findOne({ where: { id: individualContract.id_contrato_general } });
          await ContratoGeneral.update(
            { asientos_ocupados: Number(generalContract.asientos_ocupados) - 1 },
            { where: { id: individualContract.id_contrato_general } }
          );

          return res.status(200).json({
            status: 'success',
            cuotas_devueltas: installments,
            total_cuotas_devultas: total_return,
            msg: `Se liberó un asiento del Contrato general. Se devolvieron $ ${
              total_return * -1
            } en concepto de cuotas.  Se eliminaron todas las cuotas asociadas. CONSIDERE ELIMINAR EL CONTRATO`
          });
        }

        if (estado === 'pagado') {
          // Obtención de todas las cuotas asociadas al Contrato Individual que será borrado
          const installments = await Cuota.findAll({
            where: { id_contrato_individual: id, /* numero: { [Op.not]: 0 }, */ estado: 'pendiente' },
            attributes: ['id', 'valor_primer_vencimiento']
          });

          // Calculo del total a ingresar
          const total_charge = installments.reduce((acc, el) => acc + Number(el.valor_primer_vencimiento), 0);

          // Inserción del movimiento(ingreso)
          let msg = `Contrato individual editado con éxito.`;
          if (total_charge !== 0) {
            await Movimiento.create({
              importe: total_charge,
              tipo: 'ingreso',
              forma_pago: 'efectivo',
              info: `Pago de todas las cuotas pendientes del Contrato Individual ${individualContract.cod_contrato}`,
              id_usuario: user.id
            });

            msg = `Contrato individual editado con éxito. Ingresaron $ ${total_charge} en concepto de cuotas`;
          }

          // Actualización del estado de todas las cuotas
          await Promise.all(
            installments.map(async (el) => await Cuota.update({ estado: 'pagada' }, { where: { id_contrato_individual: id } }))
          );

          // Acualización del estado del contrato individual
          await ContratoIndividual.update({ estado, pagos: Number(individualContract.pagos) + Number(total_charge) }, { where: { id } });

          return res.status(200).json({
            status: 'success',
            cuotas_pagadas: installments,
            total_cuotas_pagadas: total_charge,
            msg
          });
        }

        if (estado === 'terminado') {
          const individualContract = await ContratoIndividual.findByPk(id);
          const saldado = Number(individualContract.valor_contrato) === Number(individualContract.pagos);

          if (!saldado) {
            return res.status(400).json({
              status: 'error',
              msg: 'Existen cuotas impagas. Imposible terminar contrato'
            });
          }
        }

        await ContratoIndividual.update({ estado }, { where: { id } });
        res.status(200).json({
          status: 'success',
          msg: 'Contrato individual editado con éxito'
        });
      } catch (error) {
        res.status(409).json({
          status: 'error',
          msg: 'Ha ocurrido un error al intentar editar el contrato individual',
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

      const { individualContract } = req;

      if (individualContract.estado === 'terminado') {
        // Eliminicación de todas las cuotas
        await Cuota.destroy({ where: { id_contrato_individual: id } });

        // Eliminación del contrato general
        await ContratoIndividual.destroy({ where: { id } });

        return res.status(200).json({
          status: 'success',
          msg: 'Contrato individual eliminado con éxito. Se eliminaron todas las cuotas asociadas'
        });
      }

      if (individualContract.estado === 'vigente') {
        return res.status(400).json({
          status: 'success',
          msg: 'No es posible eliminar un contrato vigente'
        });
      }

      if (individualContract.estado === 'cancelado') {
        // Eliminación del contrato general
        await ContratoIndividual.destroy({ where: { id } });

        return res.status(200).json({
          status: 'success',
          msg: 'Contrato individual eliminado con éxito. Se eliminaron todas las cuotas asociadas'
        });
      }
    } catch (error) {
      res.status(409).json({
        msg: 'Ha ocurrido un error al intentar borrar el contrato individual',
        error,
        status: 'error'
      });
    }
  }
};
