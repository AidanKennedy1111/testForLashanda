import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebase';

function EventManager() {
    const [csvs, setCsvs] = useState([]);
    const [selectedCsv, setSelectedCsv] = useState(null);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        // Fetch CSVs from Firestore
        const fetchCsvs = async () => {
            const querySnapshot = await getDocs(collection(db, "csvs"));
            const csvsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                uploadedAt: doc.data().uploadedAt.toDate().toString()
            }));
            setCsvs(csvsData);
        };
        
        fetchCsvs();
    }, []);

    const handleManageCsv = (csvContent) => {
        // Parse the CSV content into rows and prepare for checkbox management
        const csvRows = csvContent.split('\n').map((row, index) => ({
            id: index,
            content: row,
            present: false, // Initial checkbox state is false
        }));
        setRows(csvRows);
        setSelectedCsv(csvContent); // Store the entire CSV content if needed
    };

    const handleCheckboxChange = (id) => {
        setRows(rows.map(row => {
            if (row.id === id) {
                return { ...row, present: !row.present };
            }
            return row;
        }));
    };

    const handleSubmitChanges = async () => {
        const modifiedCsvContent = rows.map(row => `${row.content},${row.present ? 'present' : 'not present'}`).join('\n');

        // Upload the modified CSV content to Firestore under a new collection
        await addDoc(collection(db, "submittedcsvs"), {
            content: modifiedCsvContent,
            submittedAt: new Date(),
        });

        // Clear the selection
        setSelectedCsv(null);
        setRows([]);
    };

    return (
        <div className='eventManager'>
            <h1>Event Manager</h1>
            <p>Manage your events here.</p>
            {selectedCsv && (
                <div>
                    {rows.map(row => (
                        <div key={row.id}>
                            <input
                                type="checkbox"
                                checked={row.present}
                                onChange={() => handleCheckboxChange(row.id)}
                            /> {row.content}
                        </div>
                    ))}
                    <button onClick={handleSubmitChanges}>Submit Changes</button>
                </div>
            )}
            <ul>
                {csvs.map(csv => (
                    <li key={csv.id}>
                        {csv.uploadedAt}
                        <button onClick={() => handleManageCsv(csv.content)}>Manage</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default EventManager;
