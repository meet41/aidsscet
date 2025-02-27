import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './showstudinfo.css';
import MainStudent from './MainStudent';

const ShowStudInfo = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [batchTypes, setBatchTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [batchType, setBatchType] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        fetchData();
      } else {
        setIsLoggedIn(false);
        fetchData(); // Fetch data even if the user is not logged in
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchData = () => {
    setLoading(true);
    setError(null);

    const db = getDatabase();
    const studInfoRef = ref(db, 'studentInfo');

    // Fetch student information
    get(studInfoRef)
      .then((snapshot) => {
        setLoading(false);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedData = Object.keys(data).map((key) => ({ no: key, ...data[key] }));
          setStudents(formattedData);
          setFilteredStudents(formattedData);

          // Extract unique batch types from student data
          const uniqueBatchTypes = [...new Set(formattedData.map(student => student.batchType))];
          setBatchTypes(uniqueBatchTypes);
        } else {
          setStudents([]);
          setFilteredStudents([]);
          setBatchTypes([]);
        }
      })
      .catch((error) => {
        setLoading(false);
        setError('Error fetching student info: ' + error.message);
      });
  };

  useEffect(() => {
    if (batchType) {
      setFilteredStudents(students.filter(student => student.batchType === batchType));
    } else {
      setFilteredStudents(students);
    }
  }, [batchType, students]);

  const handleDelete = (studentNo) => {
    if (!isLoggedIn) return;

    const db = getDatabase();
    const studentRef = ref(db, `studentInfo/${studentNo}`);
    remove(studentRef)
      .then(() => {
        setFilteredStudents((prevStudents) =>
          prevStudents.filter((student) => student.no !== studentNo)
        );
      })
      .catch((error) => {
        console.error('Error deleting student:', error);
      });
  };

  const handleUpdate = (studentNo) => {
    if (!isLoggedIn) return;
    navigate(`/updatestudinfo/${studentNo}`);
  };

  return (
    <div className="show-student-info">
      <MainStudent />
      <h2 className="syllabus-header">Student Information</h2>
      {isLoggedIn && (
        <a href="/studinfo">Click here to add Student</a>
      )}
      {loading && <p className="loading-message">Loading student info...</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="filter-container">
        <label htmlFor="batchType">Filter by Batch Type:</label>
        <select
          id="batchType"
          value={batchType}
          onChange={(e) => setBatchType(e.target.value)}
        >
          <option value="">All Batches</option>
          {batchTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
      </div>
      {filteredStudents.length > 0 ? (
        <table className="syllabus-table">
          <thead>
            <tr>
              <th>Batch Type</th>
              <th>Enrollment No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Year</th>
              <th>Achievement</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.batchType}</td>
                <td>{student.enrollmentNo}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.year}</td>
                <td>{student.achievement}</td>
                <td>
                  <button
                    className="submit-button"
                    onClick={() => handleDelete(student.no)}
                    style={{ cursor: isLoggedIn ? 'pointer' : 'not-allowed' }}
                  >
                    Delete
                  </button>
                  <button
                    className="submit-button"
                    onClick={() => handleUpdate(student.no)}
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
        !loading && <p className="no-data-message">No student info found.</p>
      )}
    </div>
  );
};

export default ShowStudInfo;