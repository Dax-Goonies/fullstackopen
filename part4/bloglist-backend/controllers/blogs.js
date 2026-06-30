// Define the behavior and routes
const blogsRouter = require('express').Router()

// Import the model
const Blog = require('../models/blog')

// GET: read blogs
blogsRouter.get('/', (request, response) => {
    Blog.find({}).then(blogs => {
        response.json(blogs)
    })
})

// POST: create new blogs
blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)

    blog.save().then(result => {
        response.status(201).json(result)
    })
})

module.exports = blogsRouter