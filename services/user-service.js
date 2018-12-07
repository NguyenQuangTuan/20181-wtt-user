const async = require('async')
const config = require('../config/config')

module.exports = class UserService {
  constructor(user_repository) {
    this.user_repository = user_repository

    this.find_one = this.find_one.bind(this)
    this.update = this.update.bind(this)
  }

  find_one(condition, select, callback) {
    async.retry(
      config.retry,
      async.apply(this.user_repository.find_one, condition, select),
      (err, user) => {
        if (err) return callback(err)
        else if (!user) return callback({ type: 'Not Found' })
        else return callback(null, user)
      }
    )
  }

  update(user_id, user, callback) {
    async.retry(
      config.retry,
      async.apply(this.user_repository.update, user_id, user),
      (err, updated) => {
        return callback(err, updated)
      }
    )
  }
}