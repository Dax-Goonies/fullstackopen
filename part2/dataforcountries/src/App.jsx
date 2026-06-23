import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import CountryDetail from './components/CountryDetail'
import CountryList from './components/CountryList'


function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState(null)
  const [weather, setWeather] = useState('')

  // Filter by country name
  const filtered = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )
  
  // Load all countries from REST Countries API on mount
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {setCountries(response.data)})
      .catch(error => console.log(error))
  }, [])

  // Fetch weather when a country is selected or single match found
  useEffect(() => {
    const country = selected || (filtered.length === 1 ? filtered[0] : null)
    if (!country) return

    const capital = country.capital[0]
    // Get the API Key from .env
    const weather_key = import.meta.env.VITE_WEATHER_KEY

    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${weather_key}&units=metric`)
      .then(response => {setWeather(response.data)})
      .catch(error => console.log(error))
  }, [selected])

  return (
    <div>
      <Filter 
          filter={filter}
          handleFilterChange={(e) => {
            setFilter(e.target.value)
            setSelected(null)
          }}
      />
      {filter && filtered.length > 10 &&
        <p>Too many matches, specify another filter</p>
      }

      {filtered.length > 1 && filtered.length <= 10 && 
        <CountryList countries={filtered} onShow={setSelected} />
      }

      {filtered.length === 1 &&
        <CountryDetail country={filtered[0]} weather={weather} />
      }

      {selected && 
        <CountryDetail country={selected} weather={weather} />
      }
    </div>
  )

}
 

export default App
