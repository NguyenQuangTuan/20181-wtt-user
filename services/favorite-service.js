const async = require('async')
const config = require('../config/config')

module.exports = class {
  constructor(favorite_repository) {
    this.favorite_repository = favorite_repository

    this.find_one = this.find_one.bind(this)
    this.update = this.update.bind(this)
  }

  find_one(condition, callback) {
    async.retry(
      config.retry,
      async.apply(this.favorite_repository.find_one, condition),
      (err, favorite) => {
        if (err) return callback(err)
        else if (!favorite) return callback(null, [])
        else return callback(null, favorite.favorites)
      }
    )
  }

  update(condition, params, callback) {
    let { post_id, like } = params
    let { user_id } = condition

    async.waterfall([
      cb => {
        async.retry(
          config.retry,
          async.apply(this.favorite_repository.find_one, condition),
          (err, favorite) => {
            return cb(err, favorite)
          }
        )
      },
      (favorite, cb) => {
        let favorites = favorite ? favorite.favorites : []
        if (like) favorites.push(post_id)
        else favorites = remove_item(favorites, post_id)
        favorites = Array.from(new Set([...favorites]))
        
        let new_favorite = {
          user_id,
          favorites
        }
        this.favorite_repository.upsert(condition, new_favorite, (err, upserted) => {
          return cb(err, upserted)
        })
      }
    ], (err, upserted) => {
      return callback(err, upserted)
    })
  }
}

const remove_item = (array, item) => {
  var index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }

  return array
}