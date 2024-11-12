import React, { useState, useEffect } from 'react';


function KanbanBoard() {
    const [tickets, setTickets] = useState([]);
    const [grouping, setGrouping] = useState('status'); 
    const [sorting, setSorting] = useState('priority'); 
    const [displayOptionsVisible, setDisplayOptionsVisible] = useState(false); 
    
    const priorityLevels = {
        4: 'Urgent',
        3: 'High',
        2: 'Medium',
        1: 'Low',
        0: 'No priority',
    };


   
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch("https://api.quicksell.co/v1/internal/frontend-assignment");
                const data = await response.json();
                setTickets(data.tickets || []);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            }
        };
        fetchTickets();
    }, []);

   
    useEffect(() => {
        localStorage.setItem('grouping', grouping);
        localStorage.setItem('sorting', sorting);
    }, [grouping, sorting]);

    
    useEffect(() => {
        const savedGrouping = localStorage.getItem('grouping');
        const savedSorting = localStorage.getItem('sorting');
        if (savedGrouping) setGrouping(savedGrouping);
        if (savedSorting) setSorting(savedSorting);
    }, []);

   
    const groupTickets = (tickets, grouping) => {
        return tickets.reduce((groups, ticket) => {
            const key = ticket[grouping] || 'Unassigned';
            if (!groups[key]) groups[key] = [];
            groups[key].push(ticket);
            return groups;
        }, {});
    };

   
    const sortTickets = (groupedTickets, sorting) => {
        const sortedGroups = {};
        for (let group in groupedTickets) {
            sortedGroups[group] = groupedTickets[group].sort((a, b) => {
                if (sorting === 'priority') return b.priority - a.priority;
                if (sorting === 'title') return a.title.localeCompare(b.title);
                return 0;
            });
        }
        return sortedGroups;
    };

    
    const handleGroupingChange = (event) => {
        setGrouping(event.target.value);
    };

    
    const handleSortingChange = (event) => {
        setSorting(event.target.value);
    };

    
    const toggleDisplayOptions = () => {
        setDisplayOptionsVisible(!displayOptionsVisible);
    };

    
    const groupedTickets = groupTickets(tickets, grouping);
    const sortedTickets = sortTickets(groupedTickets, sorting);

    return (
        <div>
           
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <button  onClick={toggleDisplayOptions}> <img src="/display.svg" alt="Logo" style={{ height: '10px', marginRight: '10px' }} />Display</button>
            </div>
            
            
           
            {displayOptionsVisible && (
                <div style={{ margin: '10px 0' }}>
                    
                    <div>
                        <label>Grouping: </label>
                        <select value={grouping} onChange={handleGroupingChange}>
                            <option value="status">Status</option>
                            <option value="user">User</option>
                            <option value="priority">Priority</option>
                        </select>
                    </div>

                    
                    <div>
                        <label>Ordering: </label>
                        <select value={sorting} onChange={handleSortingChange}>
                            <option value="priority">Priority</option>
                            <option value="title">Title</option>
                        </select>
                    </div>
                </div>
            )}

           
            <div style={{ display: 'flex',justifyContent:'center' ,gap: '20px', marginTop: '20px' }}>
                {Object.keys(sortedTickets).map((group) => (
                    <div key={group} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
                        <h3>{group}</h3>
                        {sortedTickets[group].map((ticket) => (
                            <div key={ticket.id} style={{ border: '1px solid #ddd', marginBottom: '10px', padding: '5px' }}>
                                <h4>{ticket.title}</h4>
                                <p>Priority: {priorityLevels[ticket.priority]}</p>
                                <p>Status: {ticket.status}</p>
                                <p>User: {ticket.user || 'Unassigned'}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default KanbanBoard;
