module.exports = (sequelize, DataTypes) => {
  const contratoGeneral = sequelize.define(
    'ContratoGeneral', //alias
    {
      //table structure
      cod_contrato: {
        type: DataTypes.STRING(7),
        allowNull: false
      },
      descripcion: {
        type: DataTypes.STRING(55),
        allowNull: false
      },
      valor_contrato: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false
      },
      fecha_viaje: {
        type: DataTypes.DATE,
        allowNull: false
      },
      asientos_totales: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      asientos_ocupados: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      grado: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      division: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      turno: {
        type: DataTypes.CHAR(6),
        allowNull: false
      },
      contract_url: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      estado: {
        type: DataTypes.ENUM('vigente', 'terminado', 'cancelado'),
        allowNull: false
      }
    },
    {
      //configs
      tablename: 'contratos_generales',
      Timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: false
    }
  );

  contratoGeneral.associate = (models) => {
    contratoGeneral.hasMany(models.ContratoIndividual, {
      as: 'contratos_individuales',
      foreignKey: 'id_contrato_general',
      // onDelete: 'cascade' // ¿NECESARIO?
      onDelete: 'restrict'
    });
    contratoGeneral.belongsToMany(models.Responsable, {
      through: 'responsables_contratos_generales', //relation name
      foreignKey: 'id_contrato_general'
    });
    contratoGeneral.belongsTo(models.Institucion, {
      as: 'institucion', //relation name
      foreignKey: 'id_institucion',
      onDelete: 'restrict'
    });
  };

  return contratoGeneral;
};
