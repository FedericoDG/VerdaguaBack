const { Cuota, Movimiento, ContratoIndividual } = require('../database/models');

module.exports = {
  getById: (req, res) => {
    res.status(200).json({
      status: 'success',
      msg: 'Institución encontrada',
      data: req.institution
    });
  },
  createPay: async (req, res) => {
    const { id, cuota, movimiento, contratoIndividual } = req.body;

    const { descuento, recargo, diferencia_descripcion, info_tarjeta_transferencia, ...rest } = movimiento;

    await Cuota.update({ estado: cuota.estado }, { where: { id: cuota.id } });

    if (info_tarjeta_transferencia) {
      await Movimiento.create({ ...rest, info: `${rest.info}. ${info_tarjeta_transferencia}`, id_usuario: req.user.id });
    } else {
      await Movimiento.create({ ...rest, id_usuario: req.user.id });
    }

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

    if (valor_contrato === pagosHechos) {
      await ContratoIndividual.update({ estado: 'pagado' }, { where: { id } });
    }

    res.status(200).json({
      status: 'success',
      msg: 'Pago creado con éxito. Redireccionando al contrato individual'
    });
  }
};
