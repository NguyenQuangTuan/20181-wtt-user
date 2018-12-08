const express = require('express')
const body_parser = require('body-parser')
const query_handler = require('express-api-queryhandler')
const config = require('../../config/config')


// Express Setup
const app = express()
app.use(query_handler.filter())
app.use(query_handler.fields())
app.use(query_handler.pagination({ limit: 100 }))
app.use(query_handler.sort())
app.use(body_parser.urlencoded({ extended: false }))
app.use(body_parser.json())

// Data Context
const mysql_data_context = require('../../repositories/mysql-context')(config.mysql)

// Search Engine
const elasticsearch_engine = require('../../repositories/elasticsearch-engine')(config.elasticsearch)

// Message Queue
const KafkaProducer = require('../../messaging/kafka-producer')

const kafka_producer = new KafkaProducer(config.message_producer.options, config.message_producer.topic)

// Repositories
const UserRepository = require('../../repositories/user-repository')
const FollowRepository = require('../../repositories/follow-repository')
const FavoriteRepository = require('../../repositories/favorite-repository')

const user_repository = new UserRepository(elasticsearch_engine)
const follow_repository = new FollowRepository(mysql_data_context)
const favorite_repository = new FavoriteRepository(mysql_data_context)

// Services
const AuthenService = require('../../services/authen-service')
const TokenService = require('../../services/token-service')
const FollowService = require('../../services/follow-service')
const FavoriteService = require('../../services/favorite-service')
const UserService = require('../../services/user-service')

const authen_service = new AuthenService(user_repository, kafka_producer)
const token_service = new TokenService()
const follow_service = new FollowService(follow_repository)
const favorite_service = new FavoriteService(favorite_repository, kafka_producer)
const user_service = new UserService(user_repository)

// Controllers
const AuthenController = require('./controllers/authen-controller')
const FollowController = require('./controllers/follow-controller')
const FavoriteController = require('./controllers/favorite-controller')
const UserController = require('./controllers/user-controller')

const authen_controller = new AuthenController(authen_service, token_service)
const follow_controller = new FollowController(follow_service)
const favorite_controller = new FavoriteController(favorite_service)
const user_controller = new UserController(user_service)

// Routes
require('./routes/authen-route')(app, authen_controller)
require('./routes/follow-route')(app, follow_controller)
require('./routes/favorite-route')(app, favorite_controller)
require('./routes/user-route')(app, user_controller)

// Error Handling
app.use((err, req, res, next) => {
  if (err.type) {
    let { type, message, detail } = err
    let error = { type }
    if (message) Object.assign(error, { message })
    if (detail) Object.assign(error, { detail })

    switch (type) {
      case 'Bad Request':
        return res.status(400).send(error)
      case 'Unauthorized':
        return res.status(401).send(error)
      case 'Request Failed':
        return res.status(402).send(error)
      case 'Not Found':
        return res.status(404).send(error)
      case 'Duplicated':
        return res.status(409).send(error)
    }
  }

  return res.status(500).send({ error: 'Internal Server Error' })
})

// Start Server
const port = config.port
const env = process.env.NODE_ENV
app.listen(port, () => {
  console.info(`Environment: ${env}`)
  console.info(`Server is listening on port: ${port}`)
})

module.exports = app
