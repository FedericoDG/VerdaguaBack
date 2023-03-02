'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('ContratoGenerals', [
      {
        cod_contrato: 'AAA-000',
        descripcion: 'CATARATAS DEL IGUAZÚ - 7 NOCHESs - HOTEL 3 ESTRELLAS',
        valor_contrato: 90000,
        fecha_viaje: '2023-12-08',
        asientos_totales: 55,
        asientos_ocupados: 0,
        grado: '9',
        division: 'A',
        turno: 'MAÑANA',
        estado: 'vigente',
        id_institucion: '1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        descripcion: 'BARILOCHE - 10 NOCHES - HOTEL 3 ESTRELLAS',
        cod_contrato: 'BBB-000',
        valor_contrato: 150000,
        fecha_viaje: '2023-09-08',
        asientos_totales: 50,
        asientos_ocupados: 2,
        grado: '8',
        division: 'B',
        turno: 'TARDE',
        estado: 'vigente',
        id_institucion: '1',
        created_at: '2022-11-01',
        updated_at: '2022-11-01'
      },
      {
        cod_contrato: 'CCC-000',
        descripcion: 'EJEMPLO CONTRATO GENERAL TERMINADO',
        valor_contrato: 100000,
        fecha_viaje: '2022-12-08',
        asientos_totales: 50,
        asientos_ocupados: 0,
        grado: 9,
        division: 'A',
        turno: 'MAÑANA',
        estado: 'terminado',
        id_institucion: '2',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        cod_contrato: 'DDD-000',
        descripcion: 'EJEMPLO CONTRATO GENERAL CANCELADO',
        valor_contrato: 80000,
        fecha_viaje: '2023-02-20',
        asientos_totales: 45,
        asientos_ocupados: 0,
        grado: '7',
        division: 'D',
        turno: 'TARDE',
        estado: 'cancelado',
        id_institucion: '2',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ContratoGenerals', null, {});
  }
};
