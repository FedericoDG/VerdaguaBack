module.exports = (sequelize, DataTypes) => {
  const usuario = sequelize.define(
    'Usuario', //alias
    {
      //table structure
      nombre: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      apellido: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(200),
        allowNull: false
      }
    },
    {
      //configs
      tablename: 'usuarios',
      Timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: false
    }
  );

  usuario.associate = (models) => {
    usuario.belongsTo(models.Rol, {
      as: 'rol',
      foreignKey: 'id_rol'
    });
  };

  return usuario;
};
