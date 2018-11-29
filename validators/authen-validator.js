const errors_aggregator = require('./errors-aggregator')
const Validator = require('fastest-validator')

const validator = new Validator()

// Schemas
let signup = {
  type: 'object',
  props: {
    email: { type: 'email' },
    password: {
      type: 'string',
      min: 6
    },
    full_name: { type: 'string' },    
    avatar_url: { type: 'string', optional: true }
  }
}

let login = {
  type: 'object',
  props: {
    email: { type: 'email' },
    password: {
      type: 'string',
      min: 6
    }
  }
}

// Validators
let validate_signup = validator.compile({ signup })
let validate_login = validator.compile({ login })

module.exports = {
  validate_signup: (request) => {
    return errors_aggregator.aggregate(validate_signup(request))
  },
  validate_login: (request) => {
    return errors_aggregator.aggregate(validate_login(request))
  }
}