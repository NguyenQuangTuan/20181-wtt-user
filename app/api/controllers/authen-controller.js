const Token = require('../../../domain-models/token')

module.exports = class AuthenController {
  constructor(authen_service, token_service) {
    this.authen_service = authen_service
    this.token_service = token_service

    this.generate_access_token = this.generate_access_token.bind(this)
    this.signup = this.signup.bind(this)
    this.login = this.login.bind(this)
  }

  generate_access_token(req, res, next) {
    this.token_service.generate_access_token(
      res.token_obj,
      (err, authen_obj) => {
        if (err)
          next(err)
        else {
          res.authen_obj = authen_obj
          next()
        }
      }
    )
  }

  signup(req, res, next) {
    let { email, password, full_name, avatar_url = null } = req.body

    let signup_info = { email, password, full_name, avatar_url }

    this.authen_service.signup(signup_info, (err, user) => {
      if (err) next(err)
      else {
        res.token_obj = new Token(user).token
        next()
      }
    })
  }

  login(req, res, next) {
    let { email, password } = req.body
    let login_info = { email, password }

    this.authen_service.login(login_info, (err, user) => {
      if (err) next(err)
      else {
        res.token_obj = new Token(user).token
        next()
      }
    })
  }
}