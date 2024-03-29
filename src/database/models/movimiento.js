module.exports = (sequelize, DataTypes) => {
  const movimiento = sequelize.define(
    'Movimiento',
    {
      importe: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false
      },
      tipo: {
        type: DataTypes.ENUM('ingreso', 'egreso'),
        allowNull: false
      },
      forma_pago: {
        type: DataTypes.ENUM('efectivo', 'debito', 'transferencia', 'credito', 'mercadopago', 'egreso'),
        allowNull: false
      },
      info: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tablename: 'movimientos',
      Timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: false
    }
  );

  movimiento.associate = (models) => {
    movimiento.hasOne(models.Cuota, {
      as: 'cuota',
      foreignKey: 'id_movimiento'
    });
  };
  movimiento.associate = (models) => {
    movimiento.belongsTo(models.Usuario, {
      as: 'usuario',
      foreignKey: 'id_usuario'
    });
  };

  return movimiento;
};
