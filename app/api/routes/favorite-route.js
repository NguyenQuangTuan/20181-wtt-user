const favorite_middleware = require('../middlewares/favorite-middleware')
const tokent_middleware = require('../middlewares/tokent-middleware')

module.exports = (app, favorite_controller) => {
  app.get('/favorites',
    tokent_middleware.verify,
    favorite_controller.find_one,
    (req, res) => {
      res.status(200).send(res.post_ids)
    }
  )

  app.put('/favorites',
    tokent_middleware.verify,
    favorite_middleware.validate_update,
    favorite_controller.update,
    (req, res) => {
      res.status(200).send(res.updated)
    }
  )
}