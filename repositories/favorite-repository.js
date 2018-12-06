module.exports = class FavorireRepository {
  constructor(db_context) {
    this.db_context = db_context
    this.Favorite = db_context.Favorite

    this.find_one = this.find_one.bind(this)
    this.upsert = this.upsert.bind(this)
  }

  find_one(condition, callback) {
    this.Favorite
      .findOne({
        where: condition
      })
      .then(res => {
        callback(null, res && res.dataValues)
        return null
      })
      .catch(err => {
        console.error(err)
        callback(err)
        return null
      })
  }

  upsert(condition, favorire, callback) {
    this.Favorite
      .upsert(
        favorire,
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