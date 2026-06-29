// Imports & Requirements
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI)

// App setup
const app = express()

// Parse incoming JSON request bodies
app.use(express.json())

// Middleware
app.use(cors())

// Serve React frontend from dist/
app.use(express.static('dist'))

// Custom token that shows request body
morgan.token('body', (request) => {
    if (request.method === 'POST' || request.method === 'PUT') {
        return JSON.stringify(request.body)
    }
    return ''
})

// Use morgan middleware
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Schema
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
    }
})

// Clean up the data using toJSON
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// Model
const Person = mongoose.model('Person', personSchema)

// GET: All persons
app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => response.json(persons))
        .catch(error => next(error))
})

// GET: Info page
app.get('/info', (request, response, next) => {
    Person.find({}).then(persons => {
        response.send(`
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>    
        `)
    })
    .catch(error => next(error))
})

// GET: Find single person 
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            // Check if the id is valid
            if (person) response.json(person)
            else response.status(404).json({ error: 'Person not found' })
        })
        .catch(error => next(error))
})

// DELETE: Remove person 
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            // Check if the person exists before DELETE
            if (!result) return response.status(404).json({ error: 'Person not found' })
            response.status(204).end()
        })
        .catch(error => next(error))
})

// POST: Add new person
app.post('/api/persons', (request, response, next) => {
    const body = request.body
    // Check if name or number are missing
    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'Name or number missing' })
    }
    // Check if name already exists
    Person.findOne({ name: body.name })
        .then(existingPerson => {
            if (existingPerson) {
                return response.status(400).json({ error: 'Name must be unique' })
            }
            // Only if it passes validation => create new object
            const person = new Person({
                name: body.name,
                number: body.number
            })
            // Add new person to the database
            person.save()
                .then(savedPerson => response.json(savedPerson))
                .catch(error => next(error))
        })
        .catch(error => next(error))
})

// PUT: Update Person number
app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true }
    )
        .then(updatedPerson => response.json(updatedPerson))
        .catch(error => next(error))
})

// Catch-all: Serve React for any non-API route
app.get('/{*splat}', (request, response) => {
    response.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Error handling
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'Malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

// Middleware Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})