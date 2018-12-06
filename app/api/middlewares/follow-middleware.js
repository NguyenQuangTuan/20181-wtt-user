const validator = require('../../../validators/follow-validator')

const validate = {
  upsert: upsert => validator.validate_upsert({ upsert })
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

  validate_upsert: (req, res, next) => {
    let { followed_user_id, follow_status } = req.body

    let upsert = { followed_user_id, follow_status }
    let validatees = { upsert }
    let err = conduct_validating(validatees)

    if (err) next(err)
    else next()
  },
}