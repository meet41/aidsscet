import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './showalumini.css';
import MainStudent from './MainStudent';

const ShowAlumini = () => {
  const [alumini, setAlumini] = useState([]);
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
    const aluminiRef = ref(db, 'alumini');

    get(aluminiRef)
      .then((snapshot) => {
        setLoading(false);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedData = Object.keys(data).map((key) => data[key]);
          setAlumini(formattedData);
        } else {
          setAlumini([]);
        }
      })
      .catch((error) => {
        setLoading(false);
        setError('Error fetching alumni info: ' + error.message);
      });
  }, []);

  return (
    <div className="show-alumini">
      <MainStudent />
      {isLoggedIn && (
        <a href="/alumini">Click here to Add Alumni</a>
      )}
      <h2>Alumni Information</h2>
      {loading && <p className="loading-message">Loading alumni info...</p>}
      {error && <p className="error-message">{error}</p>}
      {alumini.length > 0 ? (
        <table className="alumini-table">
          <thead>
            <tr>
              <th>Batch</th>
              <th>Enrollment No</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {alumini.map((alumni, index) => (
              <tr key={index}>
                <td>{alumni.batch}</td>
                <td>{alumni.enrollment}</td>
                <td>{alumni.name}</td>
                <td>{alumni.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="no-data-message">No alumni info found.</p>
      )}
    </div>
  );
};

export default ShowAlumini;