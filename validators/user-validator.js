const errors_aggregator = require('./errors-aggregator')
const Validator = require('fastest-validator')

const validator = new Validator()

// Schemas
let update = {
  type: 'object',
  props: {
    full_name: { type: 'string' },    
    avatar_url: { type: 'string', optional: true }
  }
}

// Validators
let validate_update = validator.compile({ update })


module.exports = {
  validate_update: (request) => {
    return errors_aggregator.aggregate(validate_update(request))
  } 
}