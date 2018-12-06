module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Favorite', {
    favorite_id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    favorites: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    }
  }, {
      underscored: true,
    })
}