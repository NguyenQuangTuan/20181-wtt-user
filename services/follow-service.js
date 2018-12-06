const async = require('async')
const config = require('../config/config')

module.exports = class FollowService {
  constructor(follow_repository) {
    this.follow_repository = follow_repository

    this.find_all = this.find_all.bind(this)
    this.create = this.find_all.bind(this)
  }

  find_all(condition, callback) {
    async.retry(
      config.retry,
      async.apply(this.follow_repository.find_all, condition),
      (err, follows) => {
        return callback(err, follows)
      }
    )
  }

  upsert(condition, follow, callback) {
    async.retry(
      config.retry,
      async.apply(this.follow_repository.upsert, condition, follow),
      (err, upserted) => {
        return callback(err, upserted)
      }
    )
  }
}