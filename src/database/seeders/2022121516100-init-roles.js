'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Rols', [
      {
        name: 'super',
        descripcion: 'Súper Administrador',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'admin',
        descripcion: 'Administrador',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'user',
        descripcion: 'Usuario',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Rols', null, {});
  }
};
