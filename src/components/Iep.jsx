import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './iep.css';
import MainStudent from './MainStudent';

const Iep = () => {
  const [iepStudents, setIepStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    setLoading(true);
    setError(null);

    const db = getDatabase();
    const studInfoRef = ref(db, 'studentInfo');

    get(studInfoRef)
      .then((snapshot) => {
        setLoading(false);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const filteredData = Object.keys(data)
            .map((key) => data[key])
            .filter((student) => student.iep && student.iep.toLowerCase() === 'yes');
          setIepStudents(filteredData);
        } else {
          setIepStudents([]);
        }
      })
      .catch((error) => {
        setLoading(false);
        setError('Error fetching IEP students: ' + error.message);
      });
  }, []);

  return (
    <div className="iep-students">
      <MainStudent />
      {isLoggedIn && (
        <a href="/studinfo">Click here to Add Student</a>
      )}
      <h2>IEP Students</h2>
      {loading && <p className="loading-message">Loading IEP students...</p>}
      {error && <p className="error-message">{error}</p>}
      {iepStudents.length > 0 ? (
        <table className="iep-table">
          <thead>
            <tr>
              <th>Enrollment No</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {iepStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.enrollmentNo}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No IEP students found.</p>
      )}
    </div>
  );
};

export default Iep;