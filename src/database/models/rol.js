module.exports = (sequelize, DataTypes) => {
  const rol = sequelize.define(
    'Rol', //alias
    {
      //table structure
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
      //configs
      tablename: 'roles',
      Timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: false
    }
  );

  rol.associate = (models) => {
    rol.hasMany(models.Usuario, {
      as: 'usuarios', //relation name
      foreignKey: 'id_rol',
      onDelete: 'restrict'
    });
  };

  return rol;
};
