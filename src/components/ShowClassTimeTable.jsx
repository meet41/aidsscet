import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './ShowClassTimeTable.css'; // Import the common CSS file
import MainAcademics from './MainAcademics';

const ShowClassTimetable = () => {
  const [timetables, setTimetables] = useState([]);
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
    fetchTimetables();
  }, []);

  const fetchTimetables = () => {
    setLoading(true);
    setError(null);

    const db = getDatabase();
    const timetableRef = ref(db, 'classTimetables');

    get(timetableRef)
      .then((snapshot) => {
        setLoading(false);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedData = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
          setTimetables(formattedData);
        } else {
          setTimetables([]);
        }
      })
      .catch((error) => {
        setLoading(false);
        setError('Error fetching timetables: ' + error.message);
      });
  };

  const handleDelete = (id) => {
    if (!isLoggedIn) {
      alert('You must be logged in to delete timetables.');
      return;
    }

    const db = getDatabase();
    const timetableRef = ref(db, `classTimetables/${id}`);
    remove(timetableRef)
      .then(() => {
        setTimetables(timetables.filter((timetable) => timetable.id !== id));
      })
      .catch((error) => {
        setError('Error deleting timetable: ' + error.message);
      });
  };

  const handleUpdate = (id) => {
    if (!isLoggedIn) {
      alert('You must be logged in to update timetables.');
      return;
    }

    navigate(`/updateclasstimetable/${id}`);
  };

  return (
    <div className="syllabus-container">
      <MainAcademics />
      <h1 className="syllabus-header">Class Timetables</h1>
      {isLoggedIn && (
        <div className="link">
          <h5><a href="/addtable">Click to Add Class Time Table</a></h5>
        </div>
      )}
      {loading && <p>Loading timetables...</p>}
      {error && <p className="error-message">{error}</p>}
      {timetables.length > 0 ? (
        <table className="syllabus-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Semester</th>
              <th>PDF</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {timetables.map((item, index) => (
              <tr key={index}>
                <td>{item.no}</td>
                <td>{item.semester}</td>
                <td>
                  {item.pdfUrl && (
                    <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer">
                      View PDF
                    </a>
                  )}
                </td>
                <td className="action-buttons">
                  <button
                    className="submit-button"
                    onClick={() => handleDelete(item.id)}
                    style={{ cursor: isLoggedIn ? 'pointer' : 'not-allowed' }}
                  >
                    Delete
                  </button>
                  <button
                    className="submit-button"
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
        <p>No timetables available.</p>
      )}
    </div>
  );
};

export default ShowClassTimetable;