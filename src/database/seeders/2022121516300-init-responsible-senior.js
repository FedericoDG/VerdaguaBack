'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Responsables', [
      {
        nombre: 'Juan Carlos',
        apellido: 'García',
        documento: '28126367',
        fecha_nac: '1980-08-29',
        email: 'juancarlos@garcia.com',
        telefono: '3516114150',
        direccion: 'Lima 890',
        ciudad: 'Córdoba',
        provincia: 'Córdoba',
        codigo_postal: '5000',
        info: '',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Roberto',
        apellido: 'Garnacho',
        documento: '05515237',
        fecha_nac: '1987-08-29',
        email: 'roberto@garnacho.com',
        telefono: '3517564940',
        direccion: 'Roma 358',
        ciudad: 'Córdoba',
        provincia: 'Córdoba',
        codigo_postal: '5000',
        info: '',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Mirtha',
        apellido: 'Sierra de  Pérez',
        documento: '17234577',
        fecha_nac: '1982-08-05',
        email: 'mirtha@peres.com',
        telefono: '3512295354',
        direccion: 'Libertad 1754',
        ciudad: 'Córdoba',
        provincia: 'Córdoba',
        codigo_postal: '5000',
        info: 'Es tá casada con un tal Pérez',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Responsables', null, {});
  }
};
