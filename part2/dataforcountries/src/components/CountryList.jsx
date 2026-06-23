const CountryList = ({ countries, onShow }) => {
    if (!countries) return null
    
    return (
        <div>
            {countries.map(country =>
                <div key={country.name.common}>
                    {country.name.common} 
                    <button 
                    onClick={() => 
                        onShow(country)}
                        style={{ marginLeft: '8px'}}
                    >
                        Show
                    </button>
                </div>
            )}
        </div>
    )
}

export default CountryList