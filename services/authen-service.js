const async = require('async')
const bcrypt = require('bcryptjs')

const config = require('../config/config')
const User = require('../domain-models/user/user')
const UserEvent = require('../domain-models/event/user-event')

module.exports = class Authenservice {
  constructor(user_repository, message_producer) {
    this.user_repository = user_repository
    this.message_producer = message_producer

    this.signup = this.signup.bind(this)
    this.login = this.login.bind(this)
  }

  signup(signup_info, callback) {
    let { email, password } = signup_info
    async.waterfall([
      // Find user
      cb => {
        async.retry(
          config.retry,
          async.apply(this.user_repository.find_one, { email }, []),
          (err, user) => {
            if (err) return cb(err)
            else if (user) return cb({ type: 'Duplicated' })
            else return cb(null)
          }
        )
      },
      // Get salt
      cb => {
        bcrypt.genSalt((err, salt) => {
          return cb(err, salt)
        })
      },
      // Get hash
      (salt, cb) => {
        bcrypt.hash(password, salt, (err, hash) => {
          return cb(err, hash, salt)
        })
      },
      // Create user
      (hash, salt, cb) => {
        let user_obj = new User(Object.assign({}, signup_info, { hash, salt })).use_create

        async.retry(
          config.retry,
          async.apply(this.user_repository.create, user_obj),
          (err, created) => {
            return cb(err, user_obj)
          }
        )
      },
      // Send message
      (user, cb) => {
        send_message(this.message_producer, user, UserEvent.USER_CREATED, (err) => {
          return cb(err, user)
        })
      }
    ], (err, user) => {
      if (err) return callback(err)
      else if (user) return callback(null, user)
      else return callback({ type: 'Request Failed' })
    })
  }

  login(login_info, callback) {
    let { email, password } = login_info
    async.waterfall([
      // Find user
      cb => {
        async.retry(
          config.retry,
          async.apply(this.user_repository.find_one, { email }, []),
          (err, user) => {
            if (err) return cb(err)
            else if (!user || !user.hash) cb({ type: 'Unauthorized' })
            else return cb(null, user)
          }
        )
      },
      // Compare password
      (user, cb) => {
        bcrypt.compare(password, user.hash, (err, match) => {
          if (err) cb(err)
          else if (!match) cb({ type: 'Unauthorized' })
          else cb(null, user)
        })
      },
      // Send message
      (user, cb) => {
        send_message(this.message_producer, user, UserEvent.USER_LOGINED, (err) => {
          return cb(err, user)
        })
      }
    ], (err, user) => {
      return callback(err, user)
    })
  }
}

const send_message = (message_producer, user, action, callback) => {
  let { user_id, email } = user
  let publish_obj = {
    action: action,
    payload: {
      user: { user_id, email }
    }
  }

  async.retry(
    config.retry,
    async.apply(message_producer.send, null, user_id, publish_obj),
    err => {
      return callback(err)
    }
  )
}