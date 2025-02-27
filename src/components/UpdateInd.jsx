import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import { useNavigate, useParams } from 'react-router-dom';
import './AddSyllabus.css';

const UpdateInd = () => {
  const { id } = useParams();
  const [visitData, setVisitData] = useState({
    visitDate: '',
    placeOfVisit: '',
    faculty: '',
    reportUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVisitData = async () => {
      setLoading(true);
      setError(null);

      const db = getDatabase();
      const indRef = ref(db, `industrialVisits/${id}`);
      try {
        const snapshot = await get(indRef);
        setLoading(false);
        if (snapshot.exists()) {
          setVisitData(snapshot.val());
        } else {
          console.log('No data available');
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching visit data:', error);
        setError('Error fetching visit data: ' + error.message);
      }
    };

    fetchVisitData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVisitData({ ...visitData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getDatabase();
    const indRef = ref(db, `industrialVisits/${id}`);

    update(indRef, visitData)
      .then(() => {
        console.log('Data updated successfully!');
        navigate('/showind');
      })
      .catch((error) => {
        console.error('Error updating data:', error);
        setError('Error updating data: ' + error.message);
      });
  };

  return (
    <div className="update-ind-container">
      <h1 className="update-ind-header">Update Industrial Visit</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Visit Date:</label>
          <input type="date" name="visitDate" value={visitData.visitDate} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Place of Visit:</label>
          <input type="text" name="placeOfVisit" value={visitData.placeOfVisit} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Faculty:</label>
          <input type="text" name="faculty" value={visitData.faculty} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Report URL:</label>
          <input type="url" name="reportUrl" value={visitData.reportUrl} onChange={handleInputChange} required />
        </div>
        <button type="submit" className="submit-button">Update Visit</button>
      </form>
      {loading && <p className="loading-message">Updating visit data...</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default UpdateInd;