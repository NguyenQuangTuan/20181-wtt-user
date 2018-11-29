const jwt = require('jsonwebtoken')
const config = require('../config/config')

module.exports = class TokenService {
  constructor() {
    this.generate_access_token = this.generate_access_token.bind(this)
  }

  generate_access_token(params, callback) {
    let token_expires_at = new Date()

    token_expires_at.setTime(
      token_expires_at.getTime()
      - token_expires_at.getTimezoneOffset() * 60 * 1000
      + config.authen.token_expires_in * 1000
    )


    return callback(null, {
      token_expires_in: config.authen.token_expires_in * 1000,
      token_expires_at: token_expires_at,
      access_token: jwt.sign(params, config.authen.secret, {
        expiresIn: config.authen.token_expires_in
      })
    })
  }
}
