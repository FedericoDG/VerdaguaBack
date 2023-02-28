module.exports = (sequelize, DataTypes) => {
  const contratoIndividual = sequelize.define(
    'ContratoIndividual', //alias
    {
      //table structure
      cod_contrato: {
        type: DataTypes.STRING(16),
        allowNull: false
      },
      valor_contrato: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false
      },
      pagos: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false
      },
      recargos_pagos_segundo_vencimiento: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false
      },
      estado: {
        type: DataTypes.ENUM('vigente', 'pagado', 'terminado', 'cancelado'),
        allowNull: false
      }
    },
    {
      //configs
      tablename: 'contratos_individuales',
      Timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: false
    }
  );

  contratoIndividual.associate = (models) => {
    contratoIndividual.belongsTo(models.Pasajero, {
      as: 'pasajero', //relationship name
      foreignKey: 'id_pasajero',
      onDelete: 'restrict'
    });
    contratoIndividual.belongsTo(models.ContratoGeneral, {
      as: 'contrato_general',
      foreignKey: 'id_contrato_general'
    });
    contratoIndividual.hasMany(models.Cuota, {
      as: 'cuotas',
      foreignKey: 'id_contrato_individual'
    });
  };

  return contratoIndividual;
};
