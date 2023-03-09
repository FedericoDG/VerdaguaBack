module.exports = (sequelize, DataTypes) => {
  const parametro = sequelize.define(
    'Parametro',
    {
      alerta_dias_contrato_general: {
        type: DataTypes.INTEGER(2),
        allowNull: false
      },
      porcentaje_alerta_dias_contrato_general: {
        type: DataTypes.INTEGER(2),
        allowNull: false
      },
      dias_diferencia_cuotas: {
        type: DataTypes.INTEGER(2),
        allowNull: false
      },
      porcentaje_recargo_segundo_vencimiento: {
        type: DataTypes.INTEGER(2),
        allowNull: false
      },
      porcentaje_senia: {
        type: DataTypes.INTEGER(2),
        allowNull: false
      },
      access_token_produccion: {
        type: DataTypes.STRING(80),
        allowNull: false
      },
      ticket: {
        type: DataTypes.INTEGER(7),
        allowNull: true
      },
      dias_diferencia_primer_segundo_pago: {
        type: DataTypes.INTEGER(2),
        allowNull: true
      }
    },
    {
      tablename: 'parametros',
      Timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: false
    }
  );

  parametro.associate = (models) => {};

  return parametro;
};
