const { sequelize } = require('../../src/database/models');

//Drop all tables of the DB
sequelize.drop();
