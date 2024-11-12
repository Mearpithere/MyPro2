import React, { useState, useEffect } from 'react';
import KanbanBoard from './components/KanbanBoard';

function App() {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
            .then(response => response.json())
            .then(data => setTickets(data))
            .catch(error => setError(error));
    },[]);

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            
            <KanbanBoard tickets={tickets} />
        </div>
    );
}

export default App;

