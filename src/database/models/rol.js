module.exports = (sequelize, DataTypes) => {
  const rol = sequelize.define(
    'Rol',
    {
      name: {
        type: DataTypes.STRING(25),
        allowNull: false
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      tablename: 'roles',
      Timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: false
    }
  );

  rol.associate = (models) => {
    rol.hasMany(models.Usuario, {
      as: 'usuarios',
      foreignKey: 'id_rol',
      onDelete: 'restrict'
    });
  };

  return rol;
};
