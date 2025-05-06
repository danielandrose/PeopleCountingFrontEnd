import React, { useState } from 'react';
import axios from 'axios';
import "../cssFiles/logs.css"

export default function Logs() {
    const [openLogs, setOpenLogs] = useState(false);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://peoplecounting.onrender.com/');
            const sortedLogs = response.data
                .sort((a, b) => new Date(b.time) - new Date(a.time))
                .slice(0, 10);
            setLogs(sortedLogs);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
        setLoading(false);
    };

    const handleOpenLogs = () => {
        setOpenLogs(true);
        fetchLogs();
    };

    return (
        <div className="log-container">
            {!openLogs ? (
                <button onClick={handleOpenLogs}>Open Logs</button>
            ) : loading ? (
                <p>Loading logs...</p>
            ) : (
                <div>
                    <h3>Last 10 Logs</h3>
                    {logs.map((val) => (
                        <div key={val._id} className="count-detail">
                            <li>time: {new Date(val.time).toLocaleString()}</li>
                            <li>count: {val.count}</li>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
