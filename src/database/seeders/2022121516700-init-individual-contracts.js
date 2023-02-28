'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('ContratoIndividuals', [
      {
        cod_contrato: 'BBB-000/63000111',
        valor_contrato: 150000,
        pagos: 75000,
        recargos_pagos_segundo_vencimiento: 0,
        estado: 'vigente',
        id_contrato_general: 2,
        id_pasajero: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        cod_contrato: 'BBB-000/63000222',
        valor_contrato: 150000,
        pagos: 90000,
        recargos_pagos_segundo_vencimiento: 0,
        estado: 'vigente',
        id_contrato_general: 2,
        id_pasajero: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        cod_contrato: 'CCC-000/63000333',
        valor_contrato: 100000,
        pagos: 100000,
        recargos_pagos_segundo_vencimiento: 2000,
        estado: 'terminado',
        id_contrato_general: 3,
        id_pasajero: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        cod_contrato: 'AAA-000/63000444',
        valor_contrato: 90000,
        pagos: 49500,
        recargos_pagos_segundo_vencimiento: 1350,
        estado: 'cancelado',
        id_contrato_general: 1,
        id_pasajero: 4,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ContratoIndividuals', null, {});
  }
};
