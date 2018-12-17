const async = require('async')
const config = require('../config/config')

module.exports = class UserService {
  constructor(user_repository) {
    this.user_repository = user_repository

    this.autocomplete = this.autocomplete.bind(this)
    this.find_one = this.find_one.bind(this)
    this.find_all = this.find_all.bind(this)
    this.update = this.update.bind(this)
  }

  autocomplete(condition, select, offset, limit, callback) {
    async.retry(
      config.retry,
      async.apply(this.user_repository.autocomplete, condition, select, offset, limit),
      (err, users) => {
        return callback(err, users)
      }
    )
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

  find_all(condition, select, offset, limit, order_by, callback) {
    async.retry(
      config.retry,
      async.apply(this.user_repository.find_all, condition, select, offset, limit, order_by),
      (err, users) => {
        return callback(err, users)
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