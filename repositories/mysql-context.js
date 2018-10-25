const Sequelize = require('sequelize')

const DataContext = (config) => {
  const sequelize = new Sequelize(config.database, config.username, config.password, config)

  const User = sequelize.import('./mysql-models/user')

  return { User, sequelize }
}

module.exports = DataContext