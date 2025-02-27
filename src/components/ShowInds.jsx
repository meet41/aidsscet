import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './showind.css';

const ShowInds = () => {
  const [visits, setVisits] = useState([]);
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
    const indRef = ref(db, 'industrialVisits');

    get(indRef)
      .then((snapshot) => {
        setLoading(false);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedData = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
          setVisits(formattedData);
        } else {
          setVisits([]);
        }
      })
      .catch((error) => {
        setLoading(false);
        setError('Error fetching visits: ' + error.message);
      });
  }, []);

  const handleDelete = (id) => {
    if (!isLoggedIn) return;

    const db = getDatabase();
    const indRef = ref(db, `industrialVisits/${id}`);
    remove(indRef)
      .then(() => {
        setVisits(visits.filter(visit => visit.id !== id));
        console.log('Record deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting record:', error);
      });
  };

  const handleUpdate = (id) => {
    if (!isLoggedIn) return;
    navigate(`/updateind/${id}`);
  };

  return (
    <div className="show-industrial-visits">
      <h1>Industrial Visits</h1>
      {isLoggedIn && (
        <a className="add-link" href="/addind">Click here to Add Industry</a>
      )}
      {loading && <p className="loading-message">Loading visits...</p>}
      {error && <p className="error-message">{error}</p>}
      {visits.length > 0 ? (
        <table className="visits-table">
          <thead>
            <tr>
              <th>Visit Date</th>
              <th>Place of Visit</th>
              <th>Faculty</th>
              <th>Report</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit, index) => (
              <tr key={index}>
                <td>{visit.visitDate}</td>
                <td>{visit.placeOfVisit}</td>
                <td>{visit.faculty}</td>
                <td>
                  {visit.reportUrl && (
                    <a href={visit.reportUrl} target="_blank" rel="noopener noreferrer">
                      View Report
                    </a>
                  )}
                </td>
                <td>
                  <button className="submit-button"
                    onClick={() => handleDelete(visit.id)}
                    style={{ cursor: isLoggedIn ? 'pointer' : 'not-allowed' }}
                  >
                    Delete
                  </button>
                  <button className="submit-button"
                    onClick={() => handleUpdate(visit.id)}
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
        !loading && <p className="no-data-message">No visits found.</p>
      )}
    </div>
  );
};

export default ShowInds;