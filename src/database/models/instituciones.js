module.exports = (sequelize, DataTypes) => {
  const institucion = sequelize.define(
    'Institucion',
    {
      nombre: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      direccion: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      telefono: {
        type: DataTypes.STRING(14),
        allowNull: false
      },
      localidad: {
        type: DataTypes.STRING(45),
        allowNull: false
      }
    },
    {
      tablename: 'instituciones',
      Timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: false
    }
  );

  institucion.associate = (models) => {
    institucion.hasMany(models.ContratoGeneral, {
      as: 'contratosGenerales',
      foreignKey: 'id_institucion'
    });
  };

  return institucion;
};
