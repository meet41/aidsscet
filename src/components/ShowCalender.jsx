import React, { useState, useEffect } from 'react';
import { getDatabase, ref, query, orderByChild, equalTo, get, remove } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './ShowCalender.css'; // Import the common CSS file
import MainAcademics from './MainAcademics';

const ShowCalendar = () => {
  const [calendarType, setCalendarType] = useState('');
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleCalendarTypeChange = (selectedCalendarType) => {
    setCalendarType(selectedCalendarType);
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
    if (calendarType) {
      setLoading(true);
      setError(null);

      const db = getDatabase();
      const calendarRef = ref(db, 'calendars');
      const calendarQuery = query(calendarRef, orderByChild('calendarType'), equalTo(calendarType));

      get(calendarQuery)
        .then((snapshot) => {
          setLoading(false);
          if (snapshot.exists()) {
            const data = snapshot.val();
            const formattedData = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
            setCalendarData(formattedData);
          } else {
            setCalendarData([]);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error('Error fetching calendar data:', error);
          setError('Error fetching calendar data: ' + error.message);
        });
    }
  }, [calendarType]);

  const handleDelete = (id) => {
    if (!isLoggedIn) {
      alert('You must be logged in to delete calendars.');
      return;
    }

    const db = getDatabase();
    const calendarRef = ref(db, `calendars/${id}`);
    remove(calendarRef)
      .then(() => {
        setCalendarData(calendarData.filter((item) => item.id !== id));
      })
      .catch((error) => {
        setError('Error deleting calendar: ' + error.message);
      });
  };

  const handleUpdate = (id) => {
    if (!isLoggedIn) {
      alert('You must be logged in to update calendars.');
      return;
    }

    navigate(`/updatecalendar/${id}`);
  };

  return (
    <div className="syllabus-container">
      <MainAcademics />
      {isLoggedIn && (
        <h2><a href="/addcalender">Click here to Add Calendar</a></h2>
      )}
      <h1 className="syllabus-header">Academic Calendars</h1>

      <div className="semester-buttons">
        {['University Academic Calendar', 'College Academic Calendar', 'Department Academic Calendar'].map((type) => (
          <button
            key={type}
            className={`semester-button ${calendarType === type ? 'selected' : ''}`}
            onClick={() => handleCalendarTypeChange(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {loading && <p className="loading-message">Loading calendar data...</p>}
      {error && <p className="error-message">{error}</p>}

      {calendarData.length > 0 ? (
        <table className="syllabus-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Year</th>
              <th>Semester</th>
              <th>PDF</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {calendarData.map((item, index) => (
              <tr key={index}>
                <td>{item.calendarType}</td>
                <td>{item.academicYear}</td>
                <td>{item.semester}</td>
                <td>
                  {item.pdfUrl && (
                    <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer">
                      View PDF
                    </a>
                  )}
                </td>
                <td>
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
      ) : !loading && !error && (
        <p className="no-data-message">No calendars found for the selected type.</p>
      )}
    </div>
  );
};

export default ShowCalendar;