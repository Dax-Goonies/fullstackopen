import axios from 'axios'

// Initialize the database
const baseUrl = 'http://localhost:3001/persons'

// GET: load all persons (useEffect)
const getAll = () => {
    return axios.get(baseUrl)
    .then(response => response.data)
}

// POST: add new person (addName)
const create = (newPerson) => {
    return axios.post(baseUrl, newPerson)
    .then(response => response.data)
}

// PUT: update existing person (TODO)
const update = (id, updatedPerson) => {
    return axios
    .put(`${baseUrl}/${id}`, updatedPerson)
    .then(response => response.data)
}

// DELETE: remove person (TODO)
const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, update, remove }