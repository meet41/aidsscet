import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import { useNavigate, useParams } from 'react-router-dom';
import './AddSyllabus.css';

const UpdateAthletics = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState({
    eventDate: '',
    facultyCo: '',
    pdfUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      setError(null);

      const db = getDatabase();
      const eventRef = ref(db, `athleticEvents/${id}`);
      try {
        const snapshot = await get(eventRef);
        setLoading(false);
        if (snapshot.exists()) {
          setEventData(snapshot.val());
        } else {
          console.log('No data available');
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching event data:', error);
        setError('Error fetching event data: ' + error.message);
      }
    };

    fetchEventData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getDatabase();
    const eventRef = ref(db, `athleticEvents/${id}`);

    update(eventRef, eventData)
      .then(() => {
        console.log('Data updated successfully!');
        navigate('/athletics');
      })
      .catch((error) => {
        console.error('Error updating data:', error);
        setError('Error updating data: ' + error.message);
      });
  };

  return (
    <div className="update-athletics-container">
      <h1 className="update-athletics-header">Update Athletic Event</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Date:</label>
          <input type="date" name="eventDate" value={eventData.eventDate} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Faculty Coordinator:</label>
          <input type="text" name="facultyCo" value={eventData.facultyCo} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>PDF URL:</label>
          <input type="url" name="pdfUrl" value={eventData.pdfUrl} onChange={handleInputChange} required />
        </div>
        <button type="submit" className="submit-button">Update Event</button>
      </form>
      {loading && <p className="loading-message">Updating event data...</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default UpdateAthletics;