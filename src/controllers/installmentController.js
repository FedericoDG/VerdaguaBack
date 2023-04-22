const { Cuota, Movimiento, ContratoIndividual, Parametro } = require('../database/models');

module.exports = {
  getById: (req, res) => {
    res.status(200).json({
      status: 'success',
      msg: 'Cuota encontrada',
      data: req.institution
    });
  },
  createPay: async (req, res) => {
    const { id, cuotas, movimiento, contratoIndividual, ticket } = req.body;

    const { descuento, recargo, diferencia_descripcion, info_tarjeta_transferencia, ...rest } = movimiento;

    let movement;
    if (info_tarjeta_transferencia) {
      movement = await Movimiento.create({ ...rest, info: `${rest.info}. ${info_tarjeta_transferencia}`, id_usuario: req.user.id });
    } else {
      movement = await Movimiento.create({ ...rest, id_usuario: req.user.id });
    }

    await Parametro.update({ ticket: Number(ticket) + 1 }, { where: { id: 1 } });

    await Promise.all(
      cuotas.map(
        async (cuota) => await Cuota.update({ estado: cuota.estado, id_movimiento: movement.id, ticket }, { where: { id: cuota.id } })
      )
    );

    if (Number(descuento) > 0) {
      await Movimiento.create({
        importe: Number(descuento) * -1,
        tipo: 'egreso',
        forma_pago: 'egreso',
        info: diferencia_descripcion,
        id_usuario: req.user.id
      });
    }

    if (Number(recargo) > 0) {
      await Movimiento.create({
        importe: Number(recargo),
        tipo: 'ingreso',
        forma_pago: rest.forma_pago,
        info: diferencia_descripcion,
        id_usuario: req.user.id
      });
    }

    const individualContract = await ContratoIndividual.findByPk(id);
    const pagos = Number(individualContract.pagos);
    const recargosPagos = Number(individualContract.recargos_pagos_segundo_vencimiento);

    if (Number(contratoIndividual.recargo) > 0) {
      await ContratoIndividual.update(
        {
          pagos: pagos + Number(contratoIndividual.pago),
          recargos_pagos_segundo_vencimiento: contratoIndividual.recargo
        },
        { where: { id } }
      );
    } else {
      await ContratoIndividual.update(
        {
          pagos: pagos + Number(contratoIndividual.pago),
          recargos_pagos_segundo_vencimiento: recargosPagos + Number(contratoIndividual.recargo)
        },
        { where: { id } }
      );
    }

    const resultado = await ContratoIndividual.findByPk(id);
    const valor_contrato = resultado.valor_contrato;
    const pagosHechos = resultado.pagos;

    if (Number(valor_contrato) === Math.round(pagosHechos)) {
      console.log('TODOS LOS PAGOS HECHOS!!!');
      if (Number(valor_contrato) !== Number(pagosHechos)) {
        console.log('El redondeo: ', Number(valor_contrato), Number(pagosHechos));
        await ContratoIndividual.update({ estado: 'pagado', pagos: Number(valor_contrato) }, { where: { id } });
      } else {
        console.log('SIN redondeo');
        await ContratoIndividual.update({ estado: 'pagado' }, { where: { id } });
      }
    }

    res.status(200).json({
      status: 'success',
      msg: 'Pago creado con éxito. Redireccionando al contrato individual'
    });
  },
  unblock: async (req, res) => {
    const { id } = req.params;
    await Cuota.update({ estado: 'pendiente' }, { where: { id } });
    res.status(200).json({
      status: 'success',
      msg: 'Cuota desbloqueada',
      data: req.institution
    });
  }
};
