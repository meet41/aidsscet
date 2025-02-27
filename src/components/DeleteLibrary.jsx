import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './DeleteLibrary.css';

const DeleteLibrary = () => {
  const [retrievedData, setRetrievedData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        fetchLibraryData();
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchLibraryData = async () => {
    const db = getDatabase();
    const libraryRef = ref(db, 'library/');
    try {
      const snapshot = await get(libraryRef);
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

  const handleDelete = async (id, pdfUrl) => {
    const db = getDatabase();
    const storage = getStorage();
    const libraryRef = ref(db, 'library/' + id);
    const fileRef = storageRef(storage, pdfUrl);

    try {
      await remove(libraryRef);
      if (pdfUrl) {
        await deleteObject(fileRef);
      }
      fetchLibraryData();
      console.log('Data deleted successfully!');
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <div className="library-container">
      {isLoggedIn ? (
        <>
          <h2 className="library-header">Uploaded Library Data</h2>
          <table className="library-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>File</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {retrievedData.map((data) => (
                <tr key={data.id}>
                  <td>{data.name}</td>
                  <td><a href={data.pdfUrl} target="_blank" rel="noopener noreferrer">View File</a></td>
                  <td><button onClick={() => handleDelete(data.id, data.pdfUrl)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className="error-message">You must be logged in to delete Library data.</p>
      )}
    </div>
  );
};

export default DeleteLibrary;