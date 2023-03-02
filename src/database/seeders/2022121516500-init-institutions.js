'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Institucions', [
      {
        nombre: 'COLEGIO SAN CARLOS',
        direccion: 'ROMA 358',
        telefono: '3517564940',
        localidad: 'CÓRDOBA',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'COLEGIO Técnico N° 10',
        direccion: 'URQUIZA 572',
        telefono: '3517689362',
        localidad: 'CÓRDOBA',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Institucions', null, {});
  }
};
