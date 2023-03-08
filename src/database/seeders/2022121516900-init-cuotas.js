'use strict';
const { DateTime } = require('luxon');

const date = DateTime.now();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Cuota', [
      {
        numero: 0,
        fecha_primer_vencimiento: date.toISODate(),
        fecha_segundo_vencimiento: date.toISODate(),
        valor_primer_vencimiento: 60000,
        valor_segundo_vencimiento: 60000,
        estado: 'pagada',
        id_contrato_individual: 1,
        id_movimiento: 1,
        ticket: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        numero: 1,
        fecha_primer_vencimiento: date.plus({ days: 30 }).toISODate(),
        fecha_segundo_vencimiento: date.plus({ days: 60 }).toISODate(),
        valor_primer_vencimiento: 15000,
        valor_segundo_vencimiento: 16500,
        estado: 'pagada',
        id_contrato_individual: 1,
        id_movimiento: 2,
        ticket: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        numero: 2,
        fecha_primer_vencimiento: '2023-02-10',
        fecha_segundo_vencimiento: '2023-03-12',
        valor_primer_vencimiento: 15000,
        valor_segundo_vencimiento: 16500,
        estado: 'pendiente',
        id_contrato_individual: 1,
        ticket: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        numero: 3,
        fecha_primer_vencimiento: date.plus({ days: 90 }).toISODate(),
        fecha_segundo_vencimiento: date.plus({ days: 120 }).toISODate(),
        valor_primer_vencimiento: 15000,
        valor_segundo_vencimiento: 16500,
        estado: 'pendiente',
        id_contrato_individual: 1,
        ticket: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        numero: 4,
        fecha_primer_vencimiento: date.plus({ days: 120 }).toISODate(),
        fecha_segundo_vencimiento: date.plus({ days: 150 }).toISODate(),
        valor_primer_vencimiento: 15000,
        valor_segundo_vencimiento: 16500,
        estado: 'pendiente',
        id_contrato_individual: 1,
        ticket: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        numero: 5,
        fecha_primer_vencimiento: date.plus({ days: 150 }).toISODate(),
        fecha_segundo_vencimiento: date.plus({ days: 180 }).toISODate(),
        valor_primer_vencimiento: 15000,
        valor_segundo_vencimiento: 16500,
        estado: 'pendiente',
        id_contrato_individual: 1,
        ticket: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        numero: 6,
        fecha_primer_vencimiento: date.plus({ days: 180 }).toISODate(),
        fecha_segundo_vencimiento: date.plus({ days: 210 }).toISODate(),
        valor_primer_vencimiento: 15000,
        valor_segundo_vencimiento: 16500,
        estado: 'pendiente',
        id_contrato_individual: 1,
        ticket: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Contrato 2
      {
        numero: 0,
        fecha_primer_vencimiento: date.toISODate(),
        fecha_segundo_vencimiento: date.toISODate(),
        valor_primer_vencimiento: 60000,
        valor_segundo_vencimiento: 60000,
        estado: 'pagada',
        id_contrato_individual: 2,
        id_movimiento: 3,
        ticket: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        numero: 1,
        fecha_primer_vencimiento: date.plus({ days: 30 }).toISODate(),
        fecha_segundo_vencimiento: date.plus({ days: 60 }).toISODate(),
        valor_primer_vencimiento: 15000,
        valor_segundo_vencimiento: 16500,
        estado: 'pagada',
        id_contrato_individual: 2,
        id_movimiento: 4,
        ticket: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        numero: 2,
        fecha_primer_vencimiento: date.plus({ days: 60 }).toISODate(),
        fecha_segundo_vencimiento: date.plus({ days: 90 }).toISODate(),
        valor_primer_vencimiento: 15000,
        valor_segundo_vencimiento: 16500,
        estado: 'pagada',
        id_contrato_individual: 2,
        id_movimiento: 5,
        ticket: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        numero: 3,
        fecha_primer_vencimiento: date.plus({ days: 90 }).toISODate(),
        fecha_segundo_vencimiento: date.plus({ days: 120 }).toISODate(),
        valor_primer_vencimiento: 15000,
        valor_segundo_vencimiento: 16500,
        estado: 'pendiente',
        id_contrato_individual: 2,
        ticket: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        numero: 4,
        fecha_primer_vencimiento: date.plus({ days: 120 }).toISODate(),
        fecha_segundo_vencimiento: date.plus({ days: 150 }).toISODate(),
        valor_primer_vencimiento: 15000,
        valor_segundo_vencimiento: 16500,
        estado: 'pendiente',
        id_contrato_individual: 2,
        ticket: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        numero: 5,
        fecha_primer_vencimiento: date.plus({ days: 150 }).toISODate(),
        fecha_segundo_vencimiento: date.plus({ days: 180 }).toISODate(),
        valor_primer_vencimiento: 15000,
        valor_segundo_vencimiento: 16500,
        estado: 'pendiente',
        id_contrato_individual: 2,
        ticket: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        numero: 6,
        fecha_primer_vencimiento: date.plus({ days: 180 }).toISODate(),
        fecha_segundo_vencimiento: date.plus({ days: 210 }).toISODate(),
        valor_primer_vencimiento: 15000,
        valor_segundo_vencimiento: 16500,
        estado: 'pendiente',
        id_contrato_individual: 2,
        ticket: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Contrato 3
      {
        numero: 0,
        fecha_primer_vencimiento: date.toISODate(),
        fecha_segundo_vencimiento: date.toISODate(),
        valor_primer_vencimiento: 40000,
        valor_segundo_vencimiento: 40000,
        estado: 'pagada',
        id_contrato_individual: 3,
        id_movimiento: 6,
        ticket: 6,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        numero: 1,
        fecha_primer_vencimiento: date.plus({ days: 30 }).toISODate(),
        fecha_segundo_vencimiento: date.plus({ days: 60 }).toISODate(),
        valor_primer_vencimiento: 20000,
        valor_segundo_vencimiento: 22000,
        estado: 'pagada',
        id_contrato_individual: 3,
        id_movimiento: 7,
        ticket: 7,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        numero: 2,
        fecha_primer_vencimiento: date.plus({ days: 60 }).toISODate(),
        fecha_segundo_vencimiento: date.plus({ days: 90 }).toISODate(),
        valor_primer_vencimiento: 20000,
        valor_segundo_vencimiento: 22000,
        estado: 'pagada',
        id_contrato_individual: 3,
        id_movimiento: 8,
        ticket: 7,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        numero: 3,
        fecha_primer_vencimiento: date.plus({ days: 90 }).toISODate(),
        fecha_segundo_vencimiento: date.plus({ days: 120 }).toISODate(),
        valor_primer_vencimiento: 20000,
        valor_segundo_vencimiento: 22000,
        estado: 'pagada',
        id_contrato_individual: 3,
        id_movimiento: 9,
        ticket: 9,
        created_at: new Date(),
        updated_at: new Date()
      }
      // Contrato 4
      // No hay cuotas (contrato cancelado)
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Cuota', null, {});
  }
};
