// Imports & Requirements
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')
const express = require('express')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')


// App setup
const app = express()

// Logger
logger.info('Connecting to', config.MONGODB_URI)

// MongoDB
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB')
    })
    .catch((error) => {
        logger.error('Error connecting to MongoDB', error.message)
    })

// Start app
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app