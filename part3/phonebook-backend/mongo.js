const mongoose = require('mongoose')
require('dotenv').config()

//
if (process.argv.length < 3) {
    console.log('Give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = process.env.MONGODB_URI
application.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

mongoose.connect(url)

// Define Schema
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

// Create Model for Person
const Person = mongoose.model('Person', personSchema)

// Display all persons, if only password is provided
if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}

// If both name and number are provided -> add new person
if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({ name, number })

    person.save().then(() => {
        console.log(`Added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}