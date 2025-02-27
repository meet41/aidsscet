import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './OthersDelete.css'; // Ensure you have a corresponding CSS file

const OthersDelete = () => {
  const [retrievedData, setRetrievedData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchOthersData = async () => {
    const db = getDatabase();
    const othersRef = ref(db, 'others/');
    try {
      const snapshot = await get(othersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedData = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setRetrievedData(formattedData);
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchOthersData();
  }, []);

  const handleDelete = async (id) => {
    if (!isLoggedIn) return;

    const db = getDatabase();
    const othersRef = ref(db, `others/${id}`);
    try {
      await remove(othersRef);
      setRetrievedData(retrievedData.filter(data => data.id !== id));
      console.log('Data deleted successfully!');
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <div className="others-delete-container">
      {isLoggedIn ? (
        <>
          <h2>Quick Links</h2>
          <table className="others-delete-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>PDF Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {retrievedData.map((data) => (
                <tr key={data.id}>
                  <td>{data.name}</td>
                  <td>
                    <a href={data.pdfUrl} target="_blank" rel="noopener noreferrer">View PDF</a>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(data.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className="error-message">You must be logged in to manage quick links.</p>
      )}
    </div>
  );
};

export default OthersDelete;