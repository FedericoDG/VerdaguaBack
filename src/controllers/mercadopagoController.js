const { formatCurrency } = require('../helpers/formatCurrency');
const { Parametro, Cuota, ContratoIndividual, Movimiento, Pasajero } = require('../database/models');
const { validationResult } = require('express-validator');
const mercadopago = require('mercadopago');

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
          }
        };

        let notification_url;

        if (Array.isArray(JSON.parse(items[0].id))) {
          notification_url = `${process.env.URL_BACKEND}/mercadopago/webhooktwo?source_news=webhooks&cuotas_id=${items[0].id}&id_contrato_individual=${id_contrato_individual}&installments=${installments}`;
        } else {
          notification_url = `${process.env.URL_BACKEND}/mercadopago/webhook?source_news=webhooks&cuota_id=${items[0].id}&id_contrato_individual=${id_contrato_individual}&installments=${installments}`;
        }

        preference.notification_url = notification_url;

        const data = await mercadopago.preferences.create(preference);

        res.status(200).json({
          status: 'success',
          msg: 'MERCADOPAGO post',
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
      console.log('*********** NOTIFICACIÓN DE MERCADOPAGO ***********');

      const { cuota_id, id_contrato_individual, installments } = req.query;
      const { data, type } = req.body;
      const access_token_produccion = process.env.ACCESS_TOKEN;

      mercadopago.configure({ access_token: access_token_produccion });

      if (type === 'payment') {
        console.log(`ID: ${data.id}`);
        const { body } = await mercadopago.payment.findById(data.id);

        const { valor_primer_vencimiento, valor_segundo_vencimiento, numero, estado } = await Cuota.findByPk(cuota_id);

        if (body.status === 'approved' && estado === 'pendiente') {
          console.log('ACTUALIZO LA CUOTA A PAGADA, CARGO MOVIMIENTO, ETC.');

          // Creación del movimiento
          const contratoIndividual = await ContratoIndividual.findByPk(id_contrato_individual, {
            include: [
              {
                model: Pasajero,
                as: 'pasajero'
              }
            ],
            order: [['id', 'DESC']]
          });

          let info = `Pago de cuota ${numero} de ${installments}. Saldo: ${formatCurrency(
            Number(contratoIndividual.valor_contrato) - Number(contratoIndividual.pagos) - Number(valor_primer_vencimiento)
          )}. Contrato: ${contratoIndividual.cod_contrato}. MP ID: ${data.id}`;

          if (Number(numero) === 0) {
            info = `Pago de seña. Saldo: ${formatCurrency(
              Number(contratoIndividual.valor_contrato) - Number(contratoIndividual.pagos) - Number(valor_primer_vencimiento)
            )}. Contrato: ${contratoIndividual.cod_contrato}. MP ID: ${data.id}`;
          }

          const { id } = await Movimiento.create({
            importe: Number(body.transaction_amount),
            tipo: 'ingreso',
            forma_pago: 'mercadopago',
            info,
            id_usuario: 1
          });

          // Actualización Cuota
          await Cuota.update({ estado: 'pagada', id_movimiento: id }, { where: { id: cuota_id } });

          // Actualización Contrato Individual
          if (Number(valor_primer_vencimiento) < Number(body.transaction_amount)) {
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

          // Actualización Contrato Individual (caso: pagado por completo)
          const { valor_contrato, pagos } = await ContratoIndividual.findByPk(id_contrato_individual, {
            attributes: ['valor_contrato', 'pagos']
          });

          if (Number(valor_contrato) === Number(pagos)) {
            await ContratoIndividual.update({ estado: 'pagado' }, { where: { id: id_contrato_individual } });
          }
        } else {
          if (body.status === 'rejected') {
            console.log('NO ACTUALIZO - ESTADO DEL PAGO: RECHAZADO');
          } else if (estado !== 'pendiente') {
            console.log('NO ACTUALIZO - CUOTA YA COBRADA');
          } else {
            console.log('???????????????????????????????????????????????????');
            console.log('AVISAR AL DESARROLLADOR - CASO 2');
            console.log('???????????????????????????????????????????????????');
            console.log(req.query);
            console.log(req.body);
          }
        }
      } else {
        console.log('???????????????????????????????????????????????????');
        console.log('AVISAR AL DESARROLLADOR - CASO 1');
        console.log('???????????????????????????????????????????????????');
        console.log(req.query);
        console.log(req.body);
      }

      console.log('***************************************************');

      res.status(200).send('OK');
    } catch (error) {
      res.status(409).json({
        status: 'error',
        msq: 'Error Mercadopago'
      });
    }
  },

  webHookTwo: async (req, res) => {
    try {
      console.log('*** NOTIFICACIÓN DE MERCADOPAGO - PAGO COMPLETO ***');

      let { cuotas_id, id_contrato_individual, installments } = req.query;
      cuotas_id = JSON.parse(cuotas_id);

      const { data, type } = req.body;
      const access_token_produccion = process.env.ACCESS_TOKEN;

      mercadopago.configure({ access_token: access_token_produccion });

      if (type === 'payment') {
        console.log(`ID: ${data.id}`);
        const { body } = await mercadopago.payment.findById(data.id);

        for (const cuota_id of cuotas_id) {
          const { valor_primer_vencimiento, valor_segundo_vencimiento, numero, estado } = await Cuota.findByPk(cuota_id);

          if (body.status === 'approved' && estado === 'pendiente') {
            console.log('ACTUALIZO LA CUOTA A PAGADA, CARGO MOVIMIENTO, ETC.');

            // Creación del movimiento
            const contratoIndividual = await ContratoIndividual.findByPk(id_contrato_individual, {
              include: [
                {
                  model: Pasajero,
                  as: 'pasajero'
                }
              ],
              order: [['id', 'DESC']]
            });

            let info = `Pago de cuota ${numero} de ${installments}. Saldo: ${formatCurrency(
              Number(contratoIndividual.valor_contrato) - Number(contratoIndividual.pagos) - Number(valor_primer_vencimiento)
            )}. Contrato: ${contratoIndividual.cod_contrato}. MP ID: ${data.id}`;

            if (Number(numero) === 0) {
              info = `Pago de seña. Saldo: ${formatCurrency(
                Number(contratoIndividual.valor_contrato) - Number(contratoIndividual.pagos) - Number(valor_primer_vencimiento)
              )}. Contrato: ${contratoIndividual.cod_contrato}. MP ID: ${data.id}`;
            }

            const { id } = await Movimiento.create({
              importe: Number(valor_primer_vencimiento),
              tipo: 'ingreso',
              forma_pago: 'mercadopago',
              info,
              id_usuario: 1
            });

            // Actualización Cuota
            await Cuota.update({ estado: 'pagada', id_movimiento: id }, { where: { id: cuota_id } });

            // Actualización Contrato Individual
            const newPagos = Number(contratoIndividual.pagos) + Number(valor_primer_vencimiento);

            await ContratoIndividual.update(
              {
                pagos: newPagos
              },
              { where: { id: id_contrato_individual } }
            );

            // Actualización Contrato Individual (caso: pagado por completo)
            const { valor_contrato, pagos } = await ContratoIndividual.findByPk(id_contrato_individual, {
              attributes: ['valor_contrato', 'pagos']
            });

            if (Number(valor_contrato) === Number(pagos)) {
              await ContratoIndividual.update({ estado: 'pagado' }, { where: { id: id_contrato_individual } });
            }
          } else {
            if (body.status === 'rejected') {
              console.log('NO ACTUALIZO - ESTADO DEL PAGO: RECHAZADO');
            } else if (estado !== 'pendiente') {
              console.log('NO ACTUALIZO - CUOTA YA COBRADA');
            } else {
              console.log('???????????????????????????????????????????????????');
              console.log('AVISAR AL DESARROLLADOR - CASO 2');
              console.log('???????????????????????????????????????????????????');
              console.log(req.query);
              console.log(req.body);
            }
          }
        }
      } else {
        console.log('???????????????????????????????????????????????????');
        console.log('AVISAR AL DESARROLLADOR - CASO 1');
        console.log('???????????????????????????????????????????????????');
        console.log(req.query);
        console.log(req.body);
      }

      console.log('***************************************************');

      res.status(200).send('OK');
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

      // const data = await mercadopago.merchant_orders.findById(id);
      const data = await mercadopago.payment.findById(id);

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
