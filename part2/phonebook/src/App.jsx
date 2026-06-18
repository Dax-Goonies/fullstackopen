import { useState } from 'react'
import Person from './components/Person'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const handleNameChange = (e) => {setNewName(e.target.value)}
  const handleNumberChange = (e) => {setNewNumber(e.target.value)}
  const handleFilterChange = (e) => {setFilter(e.target.value)}

  const addName = (e) => {
    e.preventDefault()

    // Check if name already exists 
    const exists = persons.find(person =>
      person.name.toLowerCase() === newName.toLowerCase()
    )   
    
    if (exists) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    
    // If name is not in the phonebook -> add it
    const newPerson = { name: newName, number: newNumber }
    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
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
          required />
        </div>
        <div>
          number: <input 
          value={newNumber} 
          onChange={handleNumberChange}
          required />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {personsToShow.map(person =>
          <Person key={person.name} person={person} />
        )}
      </div>
    </div>
  )
}

export default App