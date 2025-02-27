import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './studinfo.css'; // Import the CSS file

const StudInfo = () => {
  const [studentData, setStudentData] = useState([]);
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
    const studInfoRef = ref(db, 'studentInfo');

    onValue(studInfoRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setStudentData(formattedData);
      }
    });
  }, []);

  const handleDelete = (id) => {
    if (!isLoggedIn) return;
    const db = getDatabase();
    const studInfoRef = ref(db, `studentInfo/${id}`);

    remove(studInfoRef)
      .then(() => {
        setStudentData((prevData) => prevData.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting student info:', error);
        setError('Error deleting student info: ' + error.message);
      });
  };

  const handleUpdate = (id) => {
    if (!isLoggedIn) return;
    navigate(`/updatestudinfo/${id}`);
  };

  return (
    <div className="student-info-container">
      <h2>Student Info List</h2>
      {error && <p className="error-message">{error}</p>}
      {studentData.length > 0 ? (
        <table className="student-info-table">
          <thead>
            <tr>
              <th>Batch Type</th>
              <th>Enrollment No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Year</th>
              <th>Achievement</th>
              <th>IEP</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {studentData.map((item) => (
              <tr key={item.id}>
                <td>{item.batchType}</td>
                <td>{item.enrollmentNo}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.year}</td>
                <td>{item.achievement}</td>
                <td>{item.iep}</td>
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
      ) : (
        <p>No student info available.</p>
      )}
    </div>
  );
};

export default StudInfo;