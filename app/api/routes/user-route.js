const tokent_middleware = require('../middlewares/tokent-middleware')
const user_middleware = require('../middlewares/user-middleware')

module.exports = (app, user_controller) => {
  // get all
  app.get('/users',
    user_controller.find_all,
    (req, res) => {
      res.status(200).send(res.users)
    }
  )
  app.get('/users/:user_id',
    user_controller.find_one,
    (req, res) => {
      res.status(200).send(res.user)
    }
  )

  // me
  app.get('/me',
    tokent_middleware.verify,
    user_controller.find_one,
    (req, res) => {
      res.status(200).send(res.user)
    }
  )

  app.put('/me',
    tokent_middleware.verify,
    user_middleware.validate_update,
    user_controller.update,
    (req, res) => {
      res.status(200).send(res.updated)
    }
  )
}