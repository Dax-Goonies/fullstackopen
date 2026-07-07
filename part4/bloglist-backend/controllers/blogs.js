// Define the behavior and routes
const blogsRouter = require('express').Router()

// Import the model
const Blog = require('../models/blog')

// GET: read all blogs
blogsRouter.get('/', (request, response) => {
    Blog.find({}).then(blogs => {
        response.json(blogs)
    })
})

// POST: create new blogs
blogsRouter.post('/', (request, response, next) => {
    const body = request.body

    if (!body.title || !body.url) {
        return response.status(400).json({ error: 'Title or url missing' })
    } 

    const blog = new Blog(body)
    blog.save()
        .then(result => response.status(201).json(result))
        .catch(error => next(error))
})

// DELETE: Remove a blog
blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        console.log('DELETE called with id:', request.params.id)
        const result = await Blog.findByIdAndDelete(request.params.id)
        console.log('Delete result:', result)
        response.status(204).end()
    } catch (error) {
        console.log('Delete error name:', error.name)
        console.log('Delete error message:', error.message)
        next(error)
    }
})

// PUT: Update a blog
blogsRouter.put('/:id', (request, response, next) => {
    const { title, author, url, likes } = request.body

    Blog.findByIdAndUpdate(
        request.params.id,
        { title, author, url, likes }, 
        { returnDocument: 'after' }
    )
        .then(updatedBlog => {
            if (!updatedBlog) {
                return response.status(404).end()
            }
                response.json(updatedBlog)
        })
        .catch(error => next(error))
})

module.exports = blogsRouter