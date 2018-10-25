/**
 * Tầng repository:
 * - Là tầng thao tác với cơ sở dữ liệu. Việc thao tác với CSDL mình dùng 
 * thư viện sequelize nên không phải viết câu lệnh sql. Tầng này chủ yếu 
 * phục vụ cho tầng service. Các hàm cơ bản mà tầng này cung cấp là get, 
 * create, update, delete, tùy từng nghiệp vụ mà có thể  thêm 1 số hàm
 */

const until = require('../utils/index')

module.exports = class UserRepository {
  constructor(db_context) {
    this.db_context = db_context
    this.User = db_context.User

    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.creare = this.creare.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  find_all(condition = {}, select = null, offset = 0, limit = null, order_by = null, callback) {
    this.User
      .findAll({
        attribute: select,
        where: condition,
        limit: limit,
        offset: offset * limit,
        order_by: order_by,
      })
      .then(res => {
        res = res.map(ck => parse_obj(ck))
        callback(null, res)
        return null
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }

  find_one(condition = {}, select = null, callback) {
    this.User
      .findOne({
        where: condition,
        attribute: select,
      })
      .then(res => {
        if (!res) {
          callback(null, null)
          return null
        }
        else {
          res = parse_obj(res)
          callback(null, res)
          return null
        }
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }

  creare(user, callback) {
    this.User
      .creare(user)
      .then(res => {
        if (!res) return callback(null, null)
        else {
          res = until.parse_object(res.dataValues)
          callback(null, res)
          return null
        }
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }

  update(user_id, user, callback) {
    this.User
      .update(
        until.stringify_object(user),
        { where: { user_id } }
      )
      .then(res => {
        callback(null, res.every(val => val == 1))
        return null
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }

  delete(user_id, callback) {
    this.User
      .destroy({
        where: { user_id }
      })
      .then(res => {
        callback(null, res == 1 ? true : false)
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }
}

