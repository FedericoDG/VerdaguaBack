'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Movimientos', [
      {
        importe: 60000,
        tipo: 'ingreso',
        forma_pago: 'efectivo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        importe: 15000,
        tipo: 'ingreso',
        forma_pago: 'credito',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        importe: 60000,
        tipo: 'ingreso',
        forma_pago: 'efectivo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        importe: 15000,
        tipo: 'ingreso',
        forma_pago: 'credito',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        importe: 15000,
        tipo: 'ingreso',
        forma_pago: 'credito',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        importe: 40000,
        tipo: 'ingreso',
        forma_pago: 'debito',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        importe: 20000,
        tipo: 'ingreso',
        forma_pago: 'efectivo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        importe: 20000,
        tipo: 'ingreso',
        forma_pago: 'efectivo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        importe: 22000,
        tipo: 'ingreso',
        forma_pago: 'mercadopago',
        info: 'Pago con vencimiento',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        importe: 36000,
        tipo: 'ingreso',
        forma_pago: 'efectivo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        importe: 14850,
        tipo: 'ingreso',
        forma_pago: 'efectivo',
        info: 'Pago con vencimiento',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        importe: -13500,
        tipo: 'egreso',
        forma_pago: 'egreso',
        info: 'Devolución de cuotas por eliminación de Contrato Individual AAA-000/63000444',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Movimientos', null, {});
  }
};
