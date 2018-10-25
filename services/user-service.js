/**
 * Tầng Service:
 * - Nhiệm vụ: Là nơi xử lý logic, tầng service nhận dữ liệu đã đc chuẩn hóa 
 * ở tầng controller bên trên và nó chỉ quan tâm tới việc xử lý logic nghiệp 
 * vụ, nếu 1 trường bắt buộc là số int thì vào đến service nó phải là int,
 * nếu không phải int nó đã bị chặn và trả về lỗi ở tầng controller và validate 
 * ở trên rồi
 */

const async = require('async')
const config = require('../config/config')

module.exports = class {
  constructor(user_repository) {
    this.user_repository = user_repository

    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.creare = this.creare.bind(this)
    this.update = this.update.bind(this)
    this.detele = this.detele.bind(this)
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

  find_one(condition, select, callback) {
    async.retry(
      config.retry,
      async.apply(this.user_repository.find_one, condition, select, (err, user) => {
        if (err) return callback(err)
        else if (!user) return callback({ type: 'Not Found' })
        else return callback(null, user)
      })
    )
  }

  creare(user, callback) {
    // Do something
    async.retry(
      config.retry,
      async.apply(this.user_repository.creare, user, (err, creared) => {
        return callback(err, creared)
      })
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

  detele(user_id, callback) {
    async.retry(
      config.retry,
      async.apply(this.user_repository.detele, user_id),
      (err, deleted) => {
        return callback(err, deleted)
      }
    )
  }
}