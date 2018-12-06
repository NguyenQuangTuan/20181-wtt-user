const Sequelize = require('sequelize')

const DataContext = (config) => {
  const sequelize = new Sequelize(config.database, config.username, config.password, config)

  const Favorite = sequelize.import('./mysql-models/favorite')
  const Follow = sequelize.import('./mysql-models/follow')

  return { sequelize, Favorite, Follow }
}

module.exports = DataContext