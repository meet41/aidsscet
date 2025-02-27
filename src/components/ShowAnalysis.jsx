import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './ShowAnalysis.css';
import MainAcademics from './MainAcademics';

function ShowAnalysis() {
  const [data, setData] = useState([]);
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
    const db = getDatabase();
    const resultsRef = ref(db, 'analysis');

    onValue(resultsRef, (snapshot) => {
      const results = snapshot.val();
      if (results) {
        const formattedData = Object.keys(results).map((key) => ({ id: key, ...results[key] }));
        setData(formattedData);
      }
    });
  }, []);

  const handleDelete = (id) => {
    if (!isLoggedIn) return;
    const db = getDatabase();
    const analysisRef = ref(db, `analysis/${id}`);

    remove(analysisRef)
      .then(() => {
        setData((prevData) => prevData.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting analysis:', error);
        setError('Error deleting analysis: ' + error.message);
      });
  };

  const handleUpdate = (id) => {
    if (!isLoggedIn) return;
    navigate(`/updateanalysis/${id}`);
  };

  return (
    <div className="syllabus-container">
      <MainAcademics />
      {isLoggedIn && (
        <h2><a href="/addanalysis">Click here to Add Analysis</a></h2>
      )}
      <h1 className="syllabus-header">Result Analysis</h1>
      {error && <p className="error-message">{error}</p>}
      <table className="syllabus-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Semester</th>
            <th>PDF</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.year}</td>
              <td>{item.semester}</td>
              <td>
                {item.pdfUrl && (
                  <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer">
                    View PDF
                  </a>
                )}
              </td>
              <td>
                <button className="submit-button"
                  onClick={() => handleDelete(item.id)}
                  disabled={!isLoggedIn}
                  style={{ cursor: isLoggedIn ? 'pointer' : 'not-allowed' }}
                >
                  Delete
                </button>
                <button className="submit-button"
                  onClick={() => handleUpdate(item.id)}
                  disabled={!isLoggedIn}
                  style={{ cursor: isLoggedIn ? 'pointer' : 'not-allowed' }}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ShowAnalysis;