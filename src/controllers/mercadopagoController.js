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
            success: `${process.env.URL_FRONTEND}/panel?feedback=success`,
            pending: `${process.env.URL_FRONTEND}/panel?feedback=pending`,
            failure: `${process.env.URL_FRONTEND}/panel?feedback=failure`
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
          notification_url: `${process.env.URL_BACKEND}/mercadopago/webhook?cuota_id=${items[0].id}&id_contrato_individual=${id_contrato_individual}&installments=${installments}`
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
    try {
      const { access_token_produccion } = await Parametro.findByPk(1);

      mercadopago.configure({ access_token: access_token_produccion });

      const { topic, id, cuota_id, id_contrato_individual, installments } = req.query;

      if (topic === 'merchant_order') {
        const order = await mercadopago.merchant_orders.findById(id);
        // 'paid'
        // 'payment_in_process'
        // 'payment_required'

        // closed
        console.log('*******************************************************');
        console.log('*******************************************************');
        console.log(order.body.status);
        console.log(order.body.order_status);
        console.log('*******************************************************');
        console.log('*******************************************************');

        const { estado } = await Cuota.findByPk(cuota_id);

        if (order.body.order_status === 'paid' && order.body.status === 'closed' && estado !== 'pagada') {
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

          const { valor_contrato, pagos } = await ContratoIndividual.findByPk(id_contrato_individual, {
            attributes: ['valor_contrato', 'pagos']
          });

          if (Number(valor_contrato) === Number(pagos)) {
            await ContratoIndividual.update({ estado: 'pagado' }, { where: { id: id_contrato_individual } });
          }

          let info = `Pago de cuota ${numero} de ${installments}. Saldo: ${formatCurrency(
            Number(contratoIndividual.valor_contrato) - Number(contratoIndividual.pagos) - Number(valor_primer_vencimiento)
          )}. Contrato: ${contratoIndividual.cod_contrato}. MP Orden: ${id}`;

          if (Number(numero) === 0) {
            info = `Pago de seña. Saldo: ${formatCurrency(
              Number(contratoIndividual.valor_contrato) - Number(contratoIndividual.pagos) - Number(valor_primer_vencimiento)
            )}. Contrato: ${contratoIndividual.cod_contrato}. MP Orden: ${id}`;
          }

          await Movimiento.create({
            importe: Number(order.body.total_amount),
            tipo: 'ingreso',
            forma_pago: 'mercadopago',
            info,
            id_usuario: 1
          });
        }
      }
      res.status(200).send('ok');
    } catch (error) {
      res.status(409).json({
        status: 'error',
        msq: 'Error Mercadopago'
      });
    }
  },
  getOrder: async (req, res) => {
    try {
      const { id } = req.params;

      const { access_token_produccion } = await Parametro.findByPk(1);

      mercadopago.configure({ access_token: access_token_produccion });

      const data = await mercadopago.merchant_orders.findById(id);

      res.status(200).json({
        status: 'success',
        msq: 'Orden de Mercadopago requperada',
        data: data.body
      });
    } catch (error) {
      res.status(409).json({
        status: 'error',
        msq: 'Error al tratar de recuperar la orden Mercadopago'
      });
    }
  }
};
