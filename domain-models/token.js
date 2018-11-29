module.exports = class Token {
  constructor(params) {
    this.token_obj = {
      user_id: params.user_id,
      email: params.email
    }
  }

  get token() {
    return this.token_obj
  }
}