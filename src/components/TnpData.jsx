import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Syllabus.css';
import MainAcademics from './MainAcademics';

const TnpData = () => {
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    setLoading(true);
    setError(null);

    const db = getDatabase();
    const bookRef = ref(db, 'tnp');

    get(bookRef)
      .then((snapshot) => {
        setLoading(false);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedData = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
          setBookData(formattedData);
        } else {
          setBookData([]);
        }
      })
      .catch((error) => {
        setLoading(false);
        setError('Error fetching book data: ' + error.message);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!isLoggedIn) return;

    const db = getDatabase();
    const bookRef = ref(db, `tnp/${id}`);

    try {
      await remove(bookRef);
      setBookData((prevData) => prevData.filter((item) => item.id !== id));
      console.log('Data deleted successfully!');
    } catch (error) {
      console.error('Error deleting book data:', error);
      setError('Error deleting book data: ' + error.message);
    }
  };

  const handleUpdate = (id) => {
    if (!isLoggedIn) return;
    navigate(`/updatetnpdata/${id}`);
  };

  return (
    <div className="show-alumini">
      <MainAcademics />
      {isLoggedIn && (
        <h3 className='book-header'>
          <a href="/addtnp">Click here to Add Tnp Data</a>
        </h3>
      )}
      <h2 className="book-header">Tnp List</h2>
      {loading && <p className="loading-message">Loading Tnp data...</p>}
      {error && <p className="error-message">{error}</p>}
      {bookData.length > 0 ? (
        <table className="alumini-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Semester</th>
              <th>Name</th>
              <th>Year</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookData.map((item, index) => (
              <tr key={index}>
                <td>{item.no}</td>
                <td>{item.semester}</td>
                <td>{item.name}</td>
                <td>{item.year}</td>
                <td>
                  <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer">View File</a>
                  <button className="submit-button"
                    onClick={() => handleDelete(item.id)}
                    style={{ cursor: isLoggedIn ? 'pointer' : 'not-allowed' }}
                  >
                    Delete
                  </button>
                  <button className="submit-button"
                    onClick={() => handleUpdate(item.id)}
                    style={{ cursor: isLoggedIn ? 'pointer' : 'not-allowed' }}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="no-data-message">No books found.</p>
      )}
    </div>
  );
};

export default TnpData;