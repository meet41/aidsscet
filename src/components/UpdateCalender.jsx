import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import './AddSyllabus.css';

const UpdateCalendar = () => {
  const { id } = useParams();
  const [calendarData, setCalendarData] = useState({
    calendarType: '',
    academicYear: '',
    semester: '',
    pdf: null,
    pdfUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCalendarData = async () => {
      setLoading(true);
      setError(null);

      const db = getDatabase();
      const calendarRef = ref(db, `calendars/${id}`);
      try {
        const snapshot = await get(calendarRef);
        setLoading(false);
        if (snapshot.exists()) {
          setCalendarData(snapshot.val());
        } else {
          console.log('No data available');
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching calendar data:', error);
        setError('Error fetching calendar data: ' + error.message);
      }
    };

    fetchCalendarData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCalendarData({ ...calendarData, [name]: value });
  };

  const handleFileChange = (e) => {
    setCalendarData({ ...calendarData, pdf: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateCalendarData(calendarData);
    navigate('/showcalender');
  };

  const updateCalendarData = async (data) => {
    const db = getDatabase();
    const storage = getStorage();

    const uploadFile = async (file, existingUrl) => {
      if (file) {
        const fileRef = storageRef(storage, `calendars/${file.name}`);
        const uploadTask = await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      }
      return existingUrl;
    };

    const pdfUrl = await uploadFile(data.pdf, data.pdfUrl);

    const calendarRef = ref(db, `calendars/${id}`);
    const updatedCalendarData = { ...data, pdfUrl };

    update(calendarRef, updatedCalendarData)
      .then(() => {
        console.log('Data updated successfully!');
        navigate('/showcalender');
      })
      .catch((error) => {
        console.error('Error updating data:', error);
        setError('Error updating data: ' + error.message);
      });
  };

  return (
    <div className="add-syllabus-container">
      <form className="add-syllabus-form" onSubmit={handleSubmit}>
        <h2>Update Calendar</h2>
        {loading && <p className="loading-message">Loading calendar data...</p>}
        {error && <p className="error-message">{error}</p>}
        <input type="text" name="calendarType" placeholder="Calendar Type" value={calendarData.calendarType} onChange={handleInputChange} required />
        <input type="text" name="academicYear" placeholder="Academic Year" value={calendarData.academicYear} onChange={handleInputChange} required />
        <input type="text" name="semester" placeholder="Semester" value={calendarData.semester} onChange={handleInputChange} required />
        <input type="file" name="pdf" onChange={handleFileChange} />
        <button type="submit">Update Calendar</button>
      </form>
    </div>
  );
};

export default UpdateCalendar;