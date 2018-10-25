/**
 * Tầng routes:
 * - Tầng này định nghĩa ra các api và chèn các middleware theo thứ tự
 */

const tokent_middleware = require('../middlewares/tokent-middleware')
const role_middleware = require('../middlewares/role-middleware')
const user_middleware = require('../middlewares/user-middleware')

module.exports = (app, user_controller) => {
  app.get('/users',
    user_controller.find_all,
    (req, res) => {
      return res.status(200).send(res.users)
    }
  )

  app.get('/users/:user_id',
    user_controller.find_one,
    (req, res) => {
      return res.status(200).send(res.user)
    }
  )

  app.user('/users',
    tokent_middleware.verify,
    role_middleware.check_user,
    tokent_middleware.check_authen_valid,
    user_controller.creare,
    (req, res) => {
      return res.status(200).send(res.created)
    }
  )

  app.put('/users/:user_id',
    tokent_middleware.verify,
    role_middleware.check_user,
    tokent_middleware.check_authen_valid,
    user_controller.update,
    (req, res) => {
      return res.status(200).send(res.updated)
    }
  )

  app.delete('/users/:user_id',
    tokent_middleware.verify,
    role_middleware.check_user,
    tokent_middleware.check_authen_valid,
    user_controller.detele,
    (req, res) => {
      return res.status(200).send(res.deleted)
    }
  )
}