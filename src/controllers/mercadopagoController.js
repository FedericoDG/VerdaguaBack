const { validationResult } = require('express-validator');
const { Parametro, Cuota, ContratoIndividual, Movimiento, Pasajero } = require('../database/models');
const mercadopago = require('mercadopago');
const { formatCurrency } = require('../helpers/formatCurrency');

module.exports = {
  post: async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const { items, id_contrato_individual, installments } = req.body;

        const { access_token_produccion } = await Parametro.findByPk(1);

        mercadopago.configure({ access_token: access_token_produccion });

        let preference = {
          items,
          back_urls: {
            // success: `http://localhost:5173/mercadopago?feedback=success&token=${items[0].id}`,
            success: `https://borrar-front.vercel.app/?feedback=success&token=${items[0].id}`,
            pending: `https://borrar-front.vercel.app/?feedback=pending&token=${items[0].id}`,
            failure: `https://borrar-front.vercel.app/?feedback=failure&token=${items[0].id}`
          },
          auto_return: 'approved',
          binary_mode: true,
          payment_methods: {
            excluded_payment_types: [
              {
                id: 'ticket'
              }
            ],
            installments: 1
          },
          // notification_url: `https://6691-152-170-151-66.sa.ngrok.io/mercadopago/webhook?cuota_id=${items[0].id}&id_contrato_individual=${id_contrato_individual}&installments=${installments}`
          notification_url: `https://borrar-back.vercel.app/mercadopago/webhook?cuota_id=${items[0].id}&id_contrato_individual=${id_contrato_individual}&installments=${installments}`
        };

        const data = await mercadopago.preferences.create(preference);

        res.status(200).json({
          status: 'success',
          msq: 'MERCADOPAGO post',
          data
        });
      } catch (error) {
        res.status(409).json({
          status: 'error',
          msg: 'Ha ocurrido un error al MERCADOPAGO',
          error
        });
      }
    } else {
      res.status(400).json({
        msg: 'El formulario tiene errores en los campos',
        error: errors,
        returnData: req.body,
        status: 'bad request'
      });
    }
  },
  webHook: async (req, res) => {
    const { access_token_produccion } = await Parametro.findByPk(1);

    mercadopago.configure({ access_token: access_token_produccion });

    const { topic, id, cuota_id, id_contrato_individual, installments } = req.query;

    if (topic === 'merchant_order') {
      const order = await mercadopago.merchant_orders.findById(id);
      // 'paid'
      // 'payment_required'

      if (order.body.order_status === 'paid' && order.body.status === 'closed') {
        await Cuota.update({ estado: 'pagada' }, { where: { id: cuota_id } });

        const { valor_primer_vencimiento, valor_segundo_vencimiento, numero } = await Cuota.findByPk(cuota_id);
        const contratoIndividual = await ContratoIndividual.findByPk(id_contrato_individual, {
          include: [
            {
              model: Pasajero,
              as: 'pasajero'
            }
          ],
          order: [['id', 'DESC']]
        });

        if (Number(valor_primer_vencimiento) < Number(order.body.total_amount)) {
          const newPagos = Number(contratoIndividual.pagos) + Number(valor_primer_vencimiento);
          const newReacargos =
            Number(contratoIndividual.recargos_pagos_segundo_vencimiento) +
            Number(valor_segundo_vencimiento) -
            Number(valor_primer_vencimiento);

          await ContratoIndividual.update(
            {
              pagos: newPagos,
              recargos_pagos_segundo_vencimiento: newReacargos
            },
            { where: { id: id_contrato_individual } }
          );
        } else {
          const newPagos = Number(contratoIndividual.pagos) + Number(valor_primer_vencimiento);
          await ContratoIndividual.update(
            {
              pagos: newPagos
            },
            { where: { id: id_contrato_individual } }
          );
        }

        await Movimiento.create({
          importe: Number(order.body.total_amount),
          tipo: 'ingreso',
          forma_pago: 'mercadopago',
          info: `pago de cuota ${numero} de ${installments}. Saldo: ${formatCurrency(
            Number(contratoIndividual.valor_contrato) - Number(contratoIndividual.pagos) + Number(valor_primer_vencimiento)
          )}. Contrato: ${contratoIndividual.cod_contrato}. Pasajero: ${contratoIndividual.pasajero.nombre} ${
            contratoIndividual.pasajero.apellido
          }, DNI: ${contratoIndividual.pasajero.documento}. MP Orden: ${id}`,
          id_usuario: 1
        });
      }
    }
    res.status(200).json({
      ok: 'ok'
    });
  }
};
