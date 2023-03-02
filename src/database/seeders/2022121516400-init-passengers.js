'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Pasajeros', [
      {
        nombre: 'ANA',
        apellido: 'GARCÍA',
        documento: '63000111',
        fecha_nac: '2010-10-06',
        obs_medicas: 'ALÉRGICA',
        id_responsable: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'LUCAS',
        apellido: 'GARCÍA',
        documento: '63000222',
        fecha_nac: '2010-10-06',
        obs_medicas: '',
        id_responsable: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'MATÍAS',
        apellido: 'GARNACHO',
        documento: '63000333',
        fecha_nac: '2008-11-26',
        obs_medicas: '',
        id_responsable: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'LAURA',
        apellido: 'PÉREZ',
        documento: '63000444',
        fecha_nac: '2005-03-21',
        obs_medicas: '',
        id_responsable: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'MANUEL',
        apellido: 'ESPÓSITO',
        documento: '63000555',
        fecha_nac: '2003-04-10',
        obs_medicas: 'HUÉRFANO',
        id_responsable: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Pasajeros', null, {});
  }
};
