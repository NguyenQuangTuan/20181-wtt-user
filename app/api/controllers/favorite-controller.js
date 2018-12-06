module.exports = class FavoriteController {
  constructor(favorite_service) {
    this.favorite_service = favorite_service

    this.find_one = this.find_one.bind(this)
    this.update = this.update.bind(this)
  }

  find_one(req, res, next) {
    let { user_id } = req.authen_user
    let condition = { user_id }

    this.favorite_service.find_one(condition, (err, post_ids) => {
      if (err) next(err)
      else {
        res.post_ids = { post_ids }
        next()
      }
    })
  }

  update(req, res, next) {
    let { user_id } = req.authen_user
    let { post_id, like } = req.body

    let condition = { user_id }
    let params = { post_id, like }

    this.favorite_service.update(condition, params, (err, updated) => {
      if (err) next(err)
      else {
        res.updated = { updated }
        next()
      }
    })
  }
}