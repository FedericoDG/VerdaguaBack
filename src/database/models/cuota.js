module.exports = (sequelize, DataTypes) => {
  const cuota = sequelize.define(
    'Cuota', //alias
    {
      //table structure
      numero: {
        type: DataTypes.INTEGER(2),
        allowNull: false
      },
      fecha_primer_vencimiento: {
        type: DataTypes.DATE,
        allowNull: false
      },
      fecha_segundo_vencimiento: {
        type: DataTypes.DATE,
        allowNull: false
      },
      valor_primer_vencimiento: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false
      },
      valor_segundo_vencimiento: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false
      },
      estado: {
        type: DataTypes.ENUM('pagada', 'pendiente', 'en-proceso'),
        allowNull: false
      }
    },
    {
      //configs
      tablename: 'cuotas',
      Timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: false
    }
  );

  cuota.associate = (models) => {
    cuota.belongsTo(models.ContratoIndividual, {
      as: 'contrato_individual',
      foreignKey: 'id_contrato_individual'
    });
    cuota.belongsTo(models.Movimiento, {
      as: 'movimiento',
      foreignKey: 'id_movimiento'
    });
  };

  return cuota;
};
