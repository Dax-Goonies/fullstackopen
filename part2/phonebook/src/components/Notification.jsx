const Notification = ({ message, type }) => {
    if (!message) return null

    const style = {
        background: type === 'error' ? '#ffcccc' : 'lightgreen',
        border: `2px solid ${type === 'error' ? 'red' : 'green'}`,
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px',
        fontSize: '20px',
        color: type === 'error' ? 'red' : 'green'
    }

    return <div style={style}>{message}</div>
}

export default Notification