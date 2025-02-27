import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import { useNavigate, useParams } from 'react-router-dom';
import './AddSyllabus.css';

const UpdateConverse = () => {
  const { id } = useParams();
  const [converseData, setConverseData] = useState({
    year: '',
    eventDate: '',
    facultyCo: '',
    studentCo: '',
    reportUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConverseData = async () => {
      setLoading(true);
      setError(null);

      const db = getDatabase();
      const converseRef = ref(db, `converses/${id}`);
      try {
        const snapshot = await get(converseRef);
        setLoading(false);
        if (snapshot.exists()) {
          setConverseData(snapshot.val());
        } else {
          console.log('No data available');
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching converse data:', error);
        setError('Error fetching converse data: ' + error.message);
      }
    };

    fetchConverseData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConverseData({ ...converseData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getDatabase();
    const converseRef = ref(db, `converses/${id}`);

    update(converseRef, converseData)
      .then(() => {
        console.log('Data updated successfully!');
        navigate('/converse');
      })
      .catch((error) => {
        console.error('Error updating data:', error);
        setError('Error updating data: ' + error.message);
      });
  };

  return (
    <div className="update-converse-container">
      <h1 className="update-converse-header">Update Converse Event</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Year:</label>
          <input type="text" name="year" value={converseData.year} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Event Date:</label>
          <input type="date" name="eventDate" value={converseData.eventDate} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Faculty Coordinator:</label>
          <input type="text" name="facultyCo" value={converseData.facultyCo} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Student Coordinator:</label>
          <input type="text" name="studentCo" value={converseData.studentCo} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Report URL:</label>
          <input type="url" name="reportUrl" value={converseData.reportUrl} onChange={handleInputChange} required />
        </div>
        <button type="submit" className="submit-button">Update Event</button>
      </form>
      {loading && <p className="loading-message">Updating event data...</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default UpdateConverse;