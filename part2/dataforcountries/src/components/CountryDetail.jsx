const CountryDetail = ({ country, weather }) => {
    if (!country) return null

    return (
        <div>
            <h2>{country.name.common}</h2>
            <div>Capital {country.capital[0]}</div>
            <div>Area {country.area}</div>

            <h3>Languages</h3>
            <ul>
                {Object.values(country.languages).map(lang =>
                    <li key={lang}>{lang}</li>
                )}

            </ul>

            <img src={country.flags.png} alt={country.name.common} />

            {weather && (
                <div>
                    <h3>Weather in {country.capital[0]}</h3>
                    <p>Temperature {weather.main.temp} Celsius</p>
                    <img 
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                        alt={weather.weather[0].description} 
                    />
                    <p>Wind {weather.wind.speed} m/s</p>
                </div>
            )}
        </div>
    )
}

export default CountryDetail