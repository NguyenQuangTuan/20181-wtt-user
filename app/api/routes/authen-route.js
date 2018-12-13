const authen_middleware = require('../middlewares/authen-middleware')
const token_middleware = require('../middlewares/tokent-middleware')

module.exports = (app, authen_controller) => {
  app.post('/oauth/signup',
    authen_middleware.validate_signup,
    authen_controller.signup,
    authen_controller.generate_access_token,
    (req, res) => {
      res.status(200).send(res.authen_obj)
    }
  )

  app.post('/oauth/login',
    authen_middleware.validate_login,
    authen_controller.login,
    authen_controller.generate_access_token,
    (req, res) => {
      res.status(200).send(res.authen_obj)
    }
  )

  app.get('/oauth/checkuser',
    token_middleware.verify,
    (req, res) => {
      res.status(200).send({ result: true })
    }
  )
}