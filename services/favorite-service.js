const async = require('async')
const config = require('../config/config')
const FavoriteEvent = require('../domain-models/event/favorite-event')

module.exports = class {
  constructor(favorite_repository, message_producer) {
    this.favorite_repository = favorite_repository
    this.message_producer = message_producer

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
        let has_push_message = true
        let favorites = favorite ? favorite.favorites : []
        if (like) {
          let results = push_item(favorites, post_id)
          favorites = results.favorites
          has_push_message = results.has_push_message
        }
        else {
          let results = remove_item(favorites, post_id)
          favorites = results.favorites
          has_push_message = results.has_push_message
        }
        favorites = Array.from(new Set([...favorites]))

        let new_favorite = {
          user_id,
          favorites
        }
        this.favorite_repository.upsert(condition, new_favorite, (err, upserted) => {
          return cb(err, upserted, has_push_message)
        })
      },
      (upserted, has_push_message, cb) => {
        if (has_push_message) {
          let publish_obj = {
            action: FavoriteEvent.FAVORITE_UPDATED,
            payload: {
              favorite: {
                user_id, post_id, like
              }
            }
          }

          async.retry(
            config.retry,
            async.apply(this.message_producer.send, null, publish_obj.payload.favorite.user_id, publish_obj),
            err => {
              return cb(err, upserted)
            }
          )
        }
        else{
          return cb(null, upserted)
        }
      }
    ], (err, upserted) => {
      return callback(err, upserted)
    })
  }
}

const remove_item = (favorites, item, ) => {
  let has_push_message = true
  let index = favorites.indexOf(item);
  if (index > -1) {
    favorites.splice(index, 1);
    has_push_message = true
  }
  else {
    has_push_message = false
  }

  return { favorites, has_push_message }
}

const push_item = (favorites, item, ) => {
  let has_push_message = true
  let index = favorites.indexOf(item);
  if (index == -1) {
    favorites.push(item)
    has_push_message = true
  }
  else {
    has_push_message = false
  }

  return { favorites, has_push_message }
}