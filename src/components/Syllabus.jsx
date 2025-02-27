import React, { useState, useEffect } from 'react';
import { getDatabase, ref, query, orderByChild, equalTo, get, remove } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Syllabus.css';
import MainAcademics from './MainAcademics';

function Syllabus() {
  const [semester, setSemester] = useState('');
  const [syllabusData, setSyllabusData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSemesterChange = (selectedSemester) => {
    setSemester(selectedSemester);
  };

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
    if (semester) {
      setLoading(true);
      setError(null);

      const db = getDatabase();
      const syllabusRef = ref(db, 'syllabus');
      const semesterQuery = query(syllabusRef, orderByChild('semester'), equalTo(semester));

      get(semesterQuery)
        .then((snapshot) => {
          setLoading(false);
          if (snapshot.exists()) {
            const data = snapshot.val();
            const formattedData = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
            setSyllabusData(formattedData);
          } else {
            setSyllabusData([]);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error('Error fetching syllabus data:', error);
          setError('Error fetching syllabus data: ' + error.message);
        });
    }
  }, [semester]);

  const handleDelete = (id) => {
    if (!isLoggedIn) return;
    const db = getDatabase();
    const syllabusRef = ref(db, `syllabus/${id}`);

    remove(syllabusRef)
      .then(() => {
        setSyllabusData((prevData) => prevData.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting syllabus data:', error);
        setError('Error deleting syllabus data: ' + error.message);
      });
  };

  const handleUpdate = (id) => {
    if (!isLoggedIn) return;
    navigate(`/updatesyllabus/${id}`);
  };

  return (
    <div className="syllabus-container">
      <MainAcademics />
      {isLoggedIn && (
        <h3 className='syllabus-header'>
          <a href="/addsyllabus">Click here to Add Syllabus</a>
        </h3>
      )}
      <h2 className="syllabus-header">Syllabus</h2>

      <div className="semester-buttons">
        {[...Array(8).keys()].map((i) => (
          <div
            key={i + 1}
            className={`semester-button ${semester === `${i + 1}` ? 'selected' : ''}`}
            onClick={() => handleSemesterChange(`${i + 1}`)}
          >
            <span>Semester {i + 1}</span>
          </div>
        ))}
      </div>

      {loading && <p className="loading-message">Loading syllabus data...</p>}
      {error && <p className="error-message">{error}</p>}

      {syllabusData.length > 0 ? (
        <table className="syllabus-table">
          <thead>
            <tr>
              <th>Subcode</th>
              <th>Name</th>
              <th>Category</th>
              <th>Effective</th>
              <th>L</th>
              <th>T</th>
              <th>P</th>
              <th>Credit</th>
              <th>PDF</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {syllabusData.map((item, index) => (
              <tr key={index}>
                <td>{item.subcode}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.effective}</td>
                <td>{item.l}</td>
                <td>{item.t}</td>
                <td>{item.p}</td>
                <td>{item.credit}</td>
                <td>
                  <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer">
                    View PDF
                  </a>
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
      ) : !loading && !error && (
        <p className="no-data-message">No syllabus found for the selected semester.</p>
      )}
    </div>
  );
}

export default Syllabus;