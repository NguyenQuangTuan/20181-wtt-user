const follow_middleware = require('../middlewares/follow-middleware')
const tokent_middleware = require('../middlewares/tokent-middleware')

module.exports = (app, follow_controller) => {
  app.get('/follows/followme', // lay ds ng fl minh
    tokent_middleware.verify,
    follow_controller.get_list_followme,
    (req, res) => {
      res.status(200).send(res.user_ids)
    }
  )

  app.get('/follows/following', // lay ds minh fl
    tokent_middleware.verify,
    follow_controller.get_list_following,
    (req, res) => {
      res.status(200).send(res.user_ids)
    }
  )

  app.put('/follows',
    tokent_middleware.verify,
    follow_middleware.validate_upsert,
    follow_controller.upsert,
    (req, res) => {
      res.status(200).send(res.upserted)
    }
  )
}