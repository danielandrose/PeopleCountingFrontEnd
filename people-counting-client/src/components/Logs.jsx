import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import "../cssFiles/logs.css";

export default function Logs() {
    const [openLogs, setOpenLogs] = useState(false);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://peoplecounting.onrender.com/');
            const data = response.data;
    
            // Sort all logs by time (newest first)
            const sortedLogs = data.sort((a, b) => new Date(b.time) - new Date(a.time));
            setLogs(sortedLogs);
    
            // Get unique days with logs (e.g., "2025-05-06")
            const dateMap = new Map();
            for (let log of sortedLogs) {
                const dateStr = new Date(log.time).toISOString().split('T')[0];
                if (!dateMap.has(dateStr)) {
                    dateMap.set(dateStr, true);
                }
                if (dateMap.size === 10) break;
            }
    
            const uniqueDates = Array.from(dateMap.keys());
            setAvailableDates(uniqueDates);
    
            const todayISO = new Date().toISOString().split('T')[0];
            const defaultDate = uniqueDates.includes(todayISO) ? todayISO : uniqueDates[0];
            setSelectedDate(defaultDate);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
        setLoading(false);
    };
    

    const handleOpenLogs = () => {
        setOpenLogs(true);
        fetchLogs();
    };

    const handleDownload = () => {
        const filtered = logs.filter(
            log => new Date(log.time).toISOString().startsWith(selectedDate)
        );

        if (!filtered.length) {
            alert("No data to download for selected date.");
            return;
        }

        const dataToExport = filtered.map(log => ({
            Date: new Date(log.time).toLocaleDateString(),
            Time: new Date(log.time).toLocaleTimeString(),
            Count: log.count
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, `logs_${selectedDate}.xlsx`);
    };

    const filteredLogs = logs
        .filter(log => new Date(log.time).toISOString().startsWith(selectedDate))
        .slice(0, 10); // Latest 10 logs of selected day

    return (
        <div className="log-container">
            {!openLogs ? (
                <div>
                    <button className="open-log-button" onClick={handleOpenLogs}>Open Logs</button>
                </div>
            ) : loading ? (
                <p>Loading logs...</p>
            ) : (
                <div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="dateSelect">Select Date: </label>
                        <select className='date-dropdown'
                            id="dateSelect"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                        >
                            {availableDates.map(date => (
                                <option key={date} value={date}>
                                    {date}
                                </option>
                            ))}
                        </select>
                        <button className="open-log-button" onClick={handleDownload} style={{ marginLeft: '1rem' }}>
                            Download
                        </button>
                    </div>

                    <h3>Last 10 Logs for {selectedDate}</h3>
                    {filteredLogs.length > 0 ? (
                        filteredLogs.map(val => (
                            <div key={val._id} className="count-detail">
                                <li>time: {new Date(val.time).toLocaleString()}</li>
                                <li>count: {val.count}</li>
                            </div>
                        ))
                    ) : (
                        <p>No logs available for this date.</p>
                    )}
                </div>
            )}
        </div>
    );
}
