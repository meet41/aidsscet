import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Athletics.css';
import MainEvent from './MainEvent';

function Athletics() {
  const [athleticEventsData, setAthleticEventsData] = useState([]);
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
    const eventsRef = ref(db, 'athleticEvents');

    get(eventsRef)
      .then((snapshot) => {
        setLoading(false);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedData = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
          setAthleticEventsData(formattedData);
        } else {
          setAthleticEventsData([]);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error fetching athletic events data:', error);
        setError('Error fetching athletic events data: ' + error.message);
      });
  }, []);

  const handleDelete = (id) => {
    if (!isLoggedIn) return;

    const db = getDatabase();
    const eventRef = ref(db, `athleticEvents/${id}`);

    remove(eventRef)
      .then(() => {
        setAthleticEventsData((prevData) => prevData.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting athletic event data:', error);
        setError('Error deleting athletic event data: ' + error.message);
      });
  };

  const handleUpdate = (id) => {
    if (!isLoggedIn) return;
    navigate(`/updateathletics/${id}`);
  };

  return (
    <div className="athletic-events-container">
      <MainEvent />
      <h2 className="athletic-events-header">Athletic Events</h2>
      {isLoggedIn && (
        <a href="/addathletics">Click here to Add Athletics</a>
      )}
      {loading && <p className="loading-message">Loading athletic events data...</p>}
      {error && <p className="error-message">{error}</p>}

      {athleticEventsData.length > 0 ? (
        <table className="athletic-events-table">
          <thead>
            <tr>
              <th>Event Date</th>
              <th>Faculty Coordinator</th>
              <th>PDF</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {athleticEventsData.map((item, index) => (
              <tr key={index}>
                <td>{item.eventDate}</td>
                <td>{item.facultyCo}</td>
                <td>
                  <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer">
                    View PDF
                  </a>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ cursor: isLoggedIn ? 'pointer' : 'not-allowed' }}
                  >
                    Delete
                  </button>
                  <button
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
      ) : !loading && !error && (
        <p className="no-data-message">No athletic events found.</p>
      )}
    </div>
  );
}

export default Athletics;