import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Syllabus.css';
import MainAcademics from './MainAcademics';

const Cd = () => {
  const [cdData, setCdData] = useState([]);
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
    const cdRef = ref(db, 'cd');

    get(cdRef)
      .then((snapshot) => {
        setLoading(false);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedData = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
          setCdData(formattedData);
        } else {
          setCdData([]);
        }
      })
      .catch((error) => {
        setLoading(false);
        setError('Error fetching CD data: ' + error.message);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!isLoggedIn) return;

    const db = getDatabase();
    const cdRef = ref(db, `cd/${id}`);

    try {
      await remove(cdRef);
      setCdData((prevData) => prevData.filter((item) => item.id !== id));
      console.log('Data deleted successfully!');
    } catch (error) {
      console.error('Error deleting CD data:', error);
      setError('Error deleting CD data: ' + error.message);
    }
  };

  const handleUpdate = (id) => {
    if (!isLoggedIn) return;
    navigate(`/updatecd/${id}`);
  };

  return (
    <div className="show-alumini">
      <MainAcademics />
      {isLoggedIn && (
        <h3 className='cd-header'>
          <a href="/addcd">Click here to Add CD</a>
        </h3>
      )}
      <h2 className="cd-header">CD List</h2>
      {loading && <p className="loading-message">Loading CD data...</p>}
      {error && <p className="error-message">{error}</p>}
      {cdData.length > 0 ? (
        <table className="alumini-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Year</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cdData.map((item, index) => (
              <tr key={index}>
                <td>{item.no}</td>
                <td>{item.year}</td>
                <td>{item.name}</td>
                <td>
                  <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">View File</a>
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
        !loading && <p className="no-data-message">No CDs found.</p>
      )}
    </div>
  );
};

export default Cd;