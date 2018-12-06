const errors_aggregator = require('./errors-aggregator')
const Validator = require('fastest-validator')

const validator = new Validator()

// Schemas
let update = {
  type: 'object',
  props: {
    post_id: { type: 'string' },
    like: { type: 'boolean' }
  }
}

// Validators
let validate_update = validator.compile({ update })

module.exports = {
  validate_update: (request) => {
    return errors_aggregator.aggregate(validate_update(request))
  },

}