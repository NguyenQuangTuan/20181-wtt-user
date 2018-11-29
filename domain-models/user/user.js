const shortid = require('shortid')
const moment = require('moment')

module.exports = class Post {
  constructor(params) {
    let props = Object.assign({
      user_id: shortid.generate(),
      avatar_url: null
    }, params)

    this.user_obj = {
      user_id: props.user_id,
      hash: props.hash,
      salt: props.salt,
      email: props.email,
      full_name: props.full_name,
      avatar_url: props.avatar_url,
      created_at: props.created_at,
      updated_at: props.updated_at
    }
  }

  get user() {
    return this.user_obj
  }

  get use_create() {
    return Object.assign(this.user_obj, {
      created_at: moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      updated_at: moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
    })
  }
}
