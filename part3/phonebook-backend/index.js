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
    name: String,
    number: String,
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

// Step 3.1 -> 3.14: GET all persons using DB
app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => response.json(persons))
        .catch(error => response.status(500).json({ error: 'Server error' }))
})

// Step 3.2 -> 3.18: GET info page
app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        response.send(`
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>    
        `)
    })
    .catch(error => response.status(500).json({ error: 'Server error' }))
})

// Step 3.3 -> 3.18: GET single person
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            // Check if the id is valid
            if (person) {
                response.json(person)
            } else {
                response.status(404).json({ error: 'Person not found' })
            }
        })
        .catch(error => response.status(400).json({ error: 'Malformatted id' }))
})

// Step 3.4 -> 3.15: DELETE person
app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            // Check if the person exists before DELETE
            if (!result) {
                return response.status(404).json({ error: 'Person not found' })
            }
            response.status(204).end()
        })
        .catch(error => response.status(500).json({ error: 'Server error' }))
})

// Step 3.5 & 3.6 -> 3.14: POST new person
app.post('/api/persons', (request, response) => {
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
                .catch(error => response.status(500).json({ error: 'Server error' }))
        })
        .catch(error => response.status(500).json({ error: 'Server error' }))
})

// 3.17: Update Person number
app.put('/api/persons/:id', (request, response) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(
        request.params.id, person, {new : true}
    )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => {
            response.status(400).json({error: 'Malformatted id'})
        })
})

// Catch-all: Serve React for any non-API route
app.get('/{*splat}', (request, response) => {
    response.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})