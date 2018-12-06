module.exports = class FollowRepository {
  constructor(db_context) {
    this.db_context = db_context
    this.Follow = db_context.Follow

    this.find_all = this.find_all.bind(this)
    this.upsert = this.upsert.bind(this)
  }

  find_all(condition, callback) {
    this.Follow
      .findAll({
        where: condition
      })
      .then(res => {
        callback(null, res.map(item => item.dataValues))
        return null
      })
      .catch(err => {
        console.error(err)
        callback(err)
        return null
      })
  }

  upsert(condition, follow, callback) {
    this.Follow
      .upsert(
        follow,
        { where: condition }
      )
      .then(res => {
        callback(null, true)
        return null
      })
      .catch(err => {
        console.error(err)
        callback(err)
        return null
      })
  }
}