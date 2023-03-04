'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Movimientos', [
      {
        importe: 60000,
        tipo: 'ingreso',
        forma_pago: 'efectivo',
        info: '',
        id_usuario: '1',
        created_at: '2023-02-28 12:00:00',
        updated_at: '2023-02-28 12:00:00'
      },
      {
        importe: 15000,
        tipo: 'ingreso',
        forma_pago: 'credito',
        info: '',
        id_usuario: '1',
        created_at: '2023-02-28 12:00:00',
        updated_at: '2023-02-28 12:00:00'
      },
      {
        importe: 60000,
        tipo: 'ingreso',
        forma_pago: 'efectivo',
        info: '',
        id_usuario: '1',
        created_at: '2023-02-28 12:00:00',
        updated_at: '2023-02-28 12:00:00'
      },
      {
        importe: 15000,
        tipo: 'ingreso',
        forma_pago: 'credito',
        info: '',
        id_usuario: '1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        importe: 15000,
        tipo: 'ingreso',
        forma_pago: 'credito',
        info: '',
        id_usuario: '1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        importe: 40000,
        tipo: 'ingreso',
        forma_pago: 'debito',
        info: '',
        id_usuario: '1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        importe: 20000,
        tipo: 'ingreso',
        forma_pago: 'efectivo',
        info: '',
        id_usuario: '1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        importe: 20000,
        tipo: 'ingreso',
        forma_pago: 'efectivo',
        info: '',
        id_usuario: '1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        importe: 22000,
        tipo: 'ingreso',
        forma_pago: 'mercadopago',
        info: 'Pago con vencimiento',
        id_usuario: '1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        importe: 36000,
        tipo: 'ingreso',
        forma_pago: 'efectivo',
        info: '',
        id_usuario: '2',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        importe: 14850,
        tipo: 'ingreso',
        forma_pago: 'efectivo',
        info: 'Pago con vencimiento',
        id_usuario: '2',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        importe: -13500,
        tipo: 'egreso',
        forma_pago: 'egreso',
        info: 'Devolución de cuotas por eliminación de Contrato Individual AAA-000/63000444',
        id_usuario: '2',
        created_at: '2023-03-02 12:00:00',
        updated_at: '2023-03-02 12:00:00'
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Movimientos', null, {});
  }
};
