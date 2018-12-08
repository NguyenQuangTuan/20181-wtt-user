module.exports = class Token {
  constructor(params) {
    this.token_obj = {
      user_id: params.user_id,
      email: params.email,
      full_name: params.full_name
    }
  }

  get token() {
    return this.token_obj
  }
}