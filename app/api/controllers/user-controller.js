const lodash = require('lodash')

module.exports = class {
  constructor(user_service) {
    this.user_service = user_service

    this.autocomplete = this.autocomplete.bind(this)
    this.find_one = this.find_one.bind(this)
    this.find_all = this.find_all.bind(this)
    this.update = this.update.bind(this)
  }

  autocomplete(req, res, next) {
    let { full_name = '' } = req.query
    let list_query_must = {}
    if (full_name) list_query_must = Object.assign(list_query_must, { full_name })

    this.user_service.autocomplete({ list_query_must }, ['full_name'], 0, 5, (err, users) => {
      if (err) next(err)
      else {
        res.users = { users }
        next()
      }
    })
  }

  find_one(req, res, next) {
    let user_id = req.params.user_id || req.authen_user.user_id || ''

    this.user_service.find_one({ user_id }, [], (err, user) => {
      if (err) next(err)
      else {
        res.user = { user: lodash.omit(user, ['hash', 'salt']) }
        next()
      }
    })
  }

  find_all(req, res, next) {
    let { user_ids, full_name } = req.query
    user_ids = user_ids && user_ids.split(',')
    let list_query_must = Object.assign({}, { full_name })
    let list_query_should = Object.assign({}, { user_ids })
    let condition = Object.assign({}, { list_query_must: handle_condition(list_query_must) }, { list_query_should: handle_condition(list_query_should) })

    let select = req.fields ? req.fields.split(' ') : []
    let offset = req.options.offset || req.options.skip
    let limit = req.options.limit
    let order_by = req.options.sort ? req.options.sort : {}
    let order_by_keys = Object.keys(order_by)
    if (order_by_keys.length == 0) order_by = []
    if (order_by_keys.length > 0) {
      order_by = order_by_keys.map(key => ({ [key]: (order_by[key] == -1) ? 'desc' : 'asc' }))
    }

    this.user_service.find_all(condition, select, offset, limit, order_by, (err, users) => {
      if (err) next(err)
      else {
        res.users = { users }
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

const handle_condition = (list_query) => {
  let condition = {}

  let list_query_keys = Object.keys(list_query)
  list_query_keys.forEach(key => {
    if (list_query[key] != undefined) {
      condition = Object.assign(condition, { [key]: list_query[key] })
    }
  })

  return condition
}