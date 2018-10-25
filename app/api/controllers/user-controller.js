/**
 * Controller: 
 * - Nhiệm vụ: điều khiển luồng xử lý, VD cùng chức năng cập nhật user, 
 * Admin có thể gửi user_id trong params nhưng thủ kho lại để user_id 
 * trong body. Ứng với mỗi TH khác nhau, tầng controller phải phát hiện và 
 * gom đầy đủ dữ liệu gửi xuống cho tầng service sử lý.
 */

module.exports = class {
  constructor(user_service) {
    this.user_service = user_service

    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.creare = this.creare.bind(this)
    this.update = this.update.bind(this)
    this.detele = this.detele.bind(this)
  }

  find_all(req, res, next) {
    let condition = {}
    let select = req.fields ? req.fields.split(' ') : null
    let offset = req.options.offset || req.options.skip
    let limit = req.options.limit
    let order_by = req.options.sort ? req.options.sort : { created_at: -1 }

    this.user_service.find_all(condition, select, offset, limit, order_by, (err, users) => {
      if (err) next(err)
      else {
        res.users = { users }
        next()
      }
    })
  }

  find_one(req, res, next) {
    let { user_id } = req.params
    let condition = { user_id }
    let select = req.fields ? req.fields.split(' ') : null

    this.user_service.find_one(condition, select, (err, user) => {
      if (err) next(err)
      else {
        res.user = { user }
        next()
      }
    })
  }

  creare(req, res, next) {
    let { user } = req.body
    this.user_service.create(user, (err, created) => {
      if (err) next(err)
      else {
        res.created = { created }
        next()
      }
    })
  }

  update(req, res, next) {
    let { user_id } = req.params
    let { user } = req.body

    this.user_service.update(user_id, user, (err, updated) => {
      if (err) next(err)
      else {
        res.updated = { updated }
        next()
      }
    })
  }

  detele(req, res, next) {
    let { user_id } = req.params

    this.user_service.detele(user_id, (err, deleted) => {
      if (err) next(err)
      else {
        res.deleted = { deleted }
        next()
      }
    })
  }
}