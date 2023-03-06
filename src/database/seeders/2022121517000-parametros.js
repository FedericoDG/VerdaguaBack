'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Parametros', [
      {
        alerta_dias_contrato_general: 90,
        porcentaje_alerta_dias_contrato_general: 10,
        dias_diferencia_cuotas: 30,
        porcentaje_recargo_segundo_vencimiento: 10,
        porcentaje_senia: 40,
        access_token_produccion: 'APP_USR-1169672341085829-030419-488d60777dec8b58801f9af246da21b0-1323355081',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Parametros', null, {});
  }
};
