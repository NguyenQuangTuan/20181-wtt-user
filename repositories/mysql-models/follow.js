module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Follow', {
    follow_id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    followed_user_id: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    follow_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'followed_user_id']
        }
      ]
    })
}