const lodash = require('lodash')

module.exports = class {
  constructor(user_service) {
    this.user_service = user_service

    this.find_one = this.find_one.bind(this)
    this.update = this.update.bind(this)
  }

  find_one(req, res, next) {
    let { user_id } = req.authen_user

    this.user_service.find_one({ user_id }, [], (err, user) => {
      if (err) next(err)
      else {
        res.user = { user: lodash.omit(user, ['hash', 'salt']) }
        next()
      }
    })
  }

  update(req, res, next) {
    let { user_id } = req.authen_user
    let { user } = req.body
    user = lodash.pick(user, ['avatar_url'])

    this.user_service.update(user_id, user, (err, updated) => {
      if (err) next(err)
      else {
        res.updated = { updated }
        next()
      }
    })
  }
}