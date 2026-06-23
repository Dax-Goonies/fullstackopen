const Filter = ({ filter, handleFilterChange }) => {
    return (
        <div>
            find countries 
            <input 
                value={filter}
                onChange={handleFilterChange}
                style={{ marginLeft: '8px'}} 
            />
        </div>
    )
}
export default Filter