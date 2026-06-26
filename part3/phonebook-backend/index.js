// Imports
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')

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

// Phonebook data
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Step 3.1: GET all persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Step 3.2: GET info page
app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>    
    `)
})

// Step 3.3: GET single person
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    // Check if the id is valid
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// Step 3.4: DELETE person
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    // Check if the person exists before DELETE
    if (!person) {
        return response.status(404).json({error: 'The person you want to delete is not found'})
    }

    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

// Step 3.5 & 3.6: POST new person
app.post('/api/persons', (request, response) => {
    const person = request.body

    // Check if name or number are missing
    if (!person.name || !person.number) {
        return response.status(400).json({error: 'The name or number is missing.'})
    }
    // Check if name already exists
    const nameExists = persons.some(p => p.name.toLowerCase() === person.name.toLowerCase())
    if (nameExists) {
        return response.status(400).json({error: 'The name must be unique'})
    }
    // Only if it passes validation => create new object
    const newPerson= {
        id: String(Math.floor(Math.random() * 100000)),
        name: person.name,
        number: person.number
    }
    // Add new person to array
    persons = persons.concat(newPerson)
    response.json(newPerson)
})

// Catch-all: Serve React for any non-API route
app.get('*splat', (request, response) => {
    response.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})