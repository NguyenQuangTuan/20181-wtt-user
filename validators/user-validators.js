const errors_aggregator = require('./errors-aggregator')
const Validator = require('fastest-validator')

const additional_error_messages = {
  authen_user: 'Requested user is not valid!'
}

const validator = new Validator({ messages: additional_error_messages })

// Schemas
let user = {
  type: 'object',
  props: {
    
  }
}

// Validators
let validate_user = validator.compile({ user })

module.exports = {
  validate_user: (request) => {
    return errors_aggregator.aggregate(validate_user(request))
  }
}