import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Include deleteDoc and doc
import { db } from './firebase';

function UploadCSV() {
    const [csvContent, setCsvContent] = useState('');
    const [csvs, setCsvs] = useState([]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCsvContent(event.target.result);
            };
            reader.readAsText(file);
        }
    };

    const uploadCsvToFirestore = async () => {
        try {
            const docRef = await addDoc(collection(db, "csvs"), {
                content: csvContent,
                uploadedAt: new Date(),
            });
            console.log("Document written with ID: ", docRef.id);
            fetchCsvs(); // Refresh the list of CSVs after upload
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const fetchCsvs = async () => {
        const querySnapshot = await getDocs(collection(db, "csvs"));
        const csvsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            uploadedAt: doc.data().uploadedAt.toDate().toString() // Convert Timestamp to String here
        }));
        setCsvs(csvsData);
    };

    // Function to delete a CSV from Firestore
    const deleteCsv = async (csvId) => {
        await deleteDoc(doc(db, "csvs", csvId));
        fetchCsvs(); // Refresh the list after deletion
    };

    // Function to display CSV content in a new window
    const viewCsvContent = (csvContent) => {
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`<pre>${csvContent}</pre>`);
    };

    useEffect(() => {
        fetchCsvs();
    }, []);

    return (
        <div className="UploadCSV">
            <h1>Upload CSV</h1>
            <p>Upload your CSV files here.</p>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button onClick={uploadCsvToFirestore}>Upload your CSV to database</button>
            <pre>{csvContent}</pre> {/* Displaying the CSV content on the page */}
            <h1>Manage CSV's</h1>
            <ul>
                {csvs.map(csv => (
                    <li key={csv.id}>
                        {csv.uploadedAt}
                        <button onClick={() => viewCsvContent(csv.content)}>View</button>
                        <button onClick={() => deleteCsv(csv.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UploadCSV;
