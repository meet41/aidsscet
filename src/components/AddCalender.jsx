import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './AddSyllabus.css';

const AddCalendar = () => {
  const [calendarData, setCalendarData] = useState({
    calendarType: '',
    academicYear: '',
    semester: '',
    pdf: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [retrievedData, setRetrievedData] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCalendarData({ ...calendarData, [name]: value });
  };

  const handleFileChange = (e) => {
    setCalendarData({ ...calendarData, pdf: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await writeCalendarData(calendarData);
    navigate('/showcalender');
  };

  const writeCalendarData = async (data) => {
    const db = getDatabase();
    const storage = getStorage();

    const uploadFile = async (file) => {
      if (file) {
        const fileRef = storageRef(storage, `calendars/${file.name}`);
        const uploadTask = await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      }
      return null;
    };

    const pdfUrl = await uploadFile(data.pdf);

    const calendarRef = ref(db, 'calendars/' + data.academicYear + '_' + data.semester);
    const newCalendarData = { ...data, pdfUrl };

    set(calendarRef, newCalendarData)
      .then(() => {
        console.log('Data written successfully!');
      })
      .catch((error) => {
        console.error('Error writing data:', error);
      });
  };

  const fetchCalendarData = async () => {
    const db = getDatabase();
    const calendarRef = ref(db, 'calendars/');
    try {
      const snapshot = await get(calendarRef);
      if (snapshot.exists()) {
        setRetrievedData(snapshot.val());
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, []);

  return (
    <div className="add-syllabus-container">
      <form className="add-syllabus-form" onSubmit={handleSubmit}>
        <select name="calendarType" value={calendarData.calendarType} onChange={handleInputChange} required>
          <option value="">Select Calendar Type</option>
          <option value="University Academic Calendar">University Academic Calendar</option>
          <option value="College Academic Calendar">College Academic Calendar</option>
          <option value="Department Academic Calendar">Department Academic Calendar</option>
        </select>
        <input type="text" name="academicYear" placeholder="Academic Year" value={calendarData.academicYear} onChange={handleInputChange} required />
        <input type="text" name="semester" placeholder="Semester" value={calendarData.semester} onChange={handleInputChange} required />
        <input type="file" name="pdf" onChange={handleFileChange} required />
        <button type="submit">Upload Calendar</button>
      </form>
    </div>
  );
};

export default AddCalendar;