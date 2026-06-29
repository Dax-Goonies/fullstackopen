import { useState, useEffect } from 'react'
import Person from './components/Person'
import Filter from './components/Filter'
import Notification from './components/Notification'
import personService from './services/persons'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  const showMessage = (text, type = 'success') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => setMessage(null), 5000)
  }

  // Load initial data
  useEffect(() => {
      personService.getAll()
      .then(data => setPersons(data))
  }, [])

  const handleNameChange = (e) => {setNewName(e.target.value)}
  const handleNumberChange = (e) => {setNewNumber(e.target.value)}
  const handleFilterChange = (e) => {setFilter(e.target.value)}

  // Add person
  const addName = (e) => {
    e.preventDefault()

    // Check if name already exists 
    const exists = persons.find(person =>
      person.name.toLowerCase() === newName.toLowerCase()
    )   
    // If the name already exists, propose to update the phonenumber
    if (exists) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = {...exists, number: newNumber}

        personService.update(exists.id, updatedPerson)
        .then(savedPerson => {
          setPersons(persons.map(p => p.id === exists.id ? savedPerson : p))
          showMessage(`Updated ${exists.name}'s number`)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          if (error.response.status === 404) {
            showMessage(`Information of ${exists.name} has already been removed from server`, 'error')
            setPersons(persons.filter(p => p.id !== exists.id))
          } else {
            showMessage(error.response.data.error, 'error')
          }
        })
      }
      return
    }
    // If the name is not in the phonebook => add it
    const newPerson = { name: newName, number: newNumber }

    personService.create(newPerson)
    .then(savedPerson => {
      setPersons(persons.concat(savedPerson))
      showMessage(`Added ${newName}`)
      setNewName('')
      setNewNumber('')
    })
    .catch(error => showMessage(error.response.data.error, 'error'))
  }

  // Delete person
  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)

    // Ask for confirmation on delete
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
    }
  }

  // Filter by name
  const personsToShow = filter === ''
      ? persons
      : persons.filter(person =>
          person.name.toLowerCase().includes(filter.toLowerCase())
      )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
      <Filter 
          filter={filter}
          handleFilterChange={(e) => setFilter(e.target.value)}
      />
      <h2>add a new</h2>
      <form onSubmit={addName}>
        <div>
          name: <input 
                value={newName} 
                onChange={handleNameChange}
                required
                minLength={3}
                />
        </div>
        <div>
          number: <input 
                value={newNumber} 
                onChange={handleNumberChange}
                required
                minLength={8}
                />
        </div>
        <button type="submit">add</button>
      </form>
      <h2>Numbers</h2>
      <div>
        {personsToShow.map(person =>
          <Person 
                key={person.name} 
                person={person}
                deletePerson={deletePerson}
          />
        )}
      </div>
    </div>
  )
}

export default App