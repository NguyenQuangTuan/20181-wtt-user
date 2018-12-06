const errors_aggregator = require('./errors-aggregator')
const Validator = require('fastest-validator')

const validator = new Validator()

// Schemas
let upsert = {
  type: 'object',
  props: {
    followed_user_id: { type: 'string' },
    follow_status: { type: 'boolean' }
  }
}

// Validators
let validate_upsert = validator.compile({ upsert })

module.exports = {
  validate_upsert: (request) => {
    return errors_aggregator.aggregate(validate_upsert(request))
  },

}