import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './DeleteAbout.css';

const DeleteAbout = () => {
  const [retrievedData, setRetrievedData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        fetchAboutUsData();
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAboutUsData = async () => {
    const db = getDatabase();
    const aboutUsRef = ref(db, 'aboutus/');
    try {
      const snapshot = await get(aboutUsRef);
      if (snapshot.exists()) {
        setRetrievedData(snapshot.val());
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (section, pdfUrl) => {
    const db = getDatabase();
    const storage = getStorage();
    const aboutUsRef = ref(db, 'aboutus/' + section);
    const fileRef = storageRef(storage, pdfUrl);

    try {
      await remove(aboutUsRef);
      if (pdfUrl) {
        await deleteObject(fileRef);
      }
      fetchAboutUsData();
      console.log('Data deleted successfully!');
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const renderTable = (section, data) => (
    <div key={section} className="about-section">
      <h2 className="about-header">{section.replace('-', ' ').toUpperCase()}</h2>
      <table className="about-table">
        <thead>
          <tr>
            <th>Section</th>
            <th>File</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{section}</td>
            <td><a href={data.pdfUrl} target="_blank" rel="noopener noreferrer">View File</a></td>
            <td><button onClick={() => handleDelete(section, data.pdfUrl)}>Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="about-container">
      {isLoggedIn ? (
        <>
          {Object.keys(retrievedData).map((section) => renderTable(section, retrievedData[section]))}
        </>
      ) : (
        <p className="error-message">You must be logged in to delete data.</p>
      )}
    </div>
  );
};

export default DeleteAbout;