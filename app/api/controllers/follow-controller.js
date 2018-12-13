module.exports = class FollowController {
  constructor(follow_service) {
    this.follow_service = follow_service

    this.get_list_followme = this.get_list_followme.bind(this)
    this.get_list_following = this.get_list_following.bind(this)
    this.upsert = this.upsert.bind(this)
    this.get_list_followme_by_user_id = this.get_list_followme_by_user_id.bind(this)
    this.get_list_following_by_user_id = this.get_list_following_by_user_id.bind(this)
  }

  get_list_followme(req, res, next) {
    let { user_id } = req.authen_user
    let condition = {
      followed_user_id: user_id,
      follow_status: true
    }

    this.follow_service.find_all(condition, (err, follows) => {
      if (err) next(err)
      else {
        res.user_ids = { user_ids: follows.map(f => f.user_id) }
        next()
      }
    })
  }

  get_list_following(req, res, next) {
    let { user_id } = req.authen_user
    let condition = {
      user_id,
      follow_status: true
    }

    this.follow_service.find_all(condition, (err, follows) => {
      if (err) next(err)
      else {
        res.user_ids = { user_ids: follows.map(f => f.followed_user_id) }
        next()
      }
    })
  }

  upsert(req, res, next) {
    let { user_id } = req.authen_user
    let { followed_user_id, follow_status } = req.body
    let follow = Object.assign({}, { user_id, followed_user_id, follow_status })

    this.follow_service.upsert({ user_id, followed_user_id }, follow, (err, upserted) => {
      if (err) next(err)
      else {
        res.upserted = { follow }
        next()
      }
    })
  }

  get_list_followme_by_user_id(req, res, next) {
    let { user_id } = req.query
    let condition = {
      followed_user_id: user_id,
      follow_status: true
    }

    this.follow_service.find_all(condition, (err, follows) => {
      if (err) next(err)
      else {
        res.user_ids = { user_ids: follows.map(f => f.user_id) }
        next()
      }
    })
  }

  get_list_following_by_user_id(req, res, next) {
    let { user_id } = req.query
    let condition = {
      user_id,
      follow_status: true
    }

    this.follow_service.find_all(condition, (err, follows) => {
      if (err) next(err)
      else {
        res.user_ids = { user_ids: follows.map(f => f.followed_user_id) }
        next()
      }
    })
  }
}