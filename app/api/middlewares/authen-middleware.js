const validator = require('../../../validators/authen-validator')

const validate = {
  signup: signup => validator.validate_signup({ signup }),
  login: login => validator.validate_login({ login }),
}

const conduct_validating = validatees => {
  let validatees_keys = Object.keys(validatees)
  for (let i = 0; i < validatees_keys.length; i++) {
    let validatee = validatees_keys[i]

    if (!validatees[validatee]) continue
    let result = validate[validatee](validatees[validatee])
    if (!result.is_valid) return ({ type: 'Bad Request', detail: result.errors })
  }

  return null
}

module.exports = {

  validate_signup: (req, res, next) => {
    let { email, password, full_name, avatar_url } = req.body

    let signup = { email, password, full_name, avatar_url }
    let validatees = { signup }
    let err = conduct_validating(validatees)

    if (err) next(err)
    else next()
  },

  validate_login: (req, res, next) => {
    let { email, password } = req.body

    let login = { email, password }
    let validatees = { login }
    let err = conduct_validating(validatees)

    if (err) next(err)
    else next()
  }
}