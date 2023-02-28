'use strict';

const bcrypt = require('../../helpers/bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Usuarios', [
      {
        nombre: 'David',
        apellido: 'Sánchez',
        email: 'super@admin.com',
        password: await bcrypt.hash('super33'),
        id_rol: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Daniel',
        apellido: 'Mercado',
        email: 'admin@admin.com',
        password: await bcrypt.hash('super33'),
        id_rol: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Guillermo',
        apellido: 'Ochoa',
        email: 'user@admin.com',
        password: await bcrypt.hash('super33'),
        id_rol: 3,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Usuarios', null, {});
  }
};
