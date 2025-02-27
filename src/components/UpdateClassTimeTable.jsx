import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import './AddClassTimeTable.css';

const UpdateClassTimetable = () => {
  const { id } = useParams();
  const [timetableData, setTimetableData] = useState({
    no: '',
    semester: '',
    pdf: null,
    pdfUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTimetableData = async () => {
      setLoading(true);
      setError(null);

      const db = getDatabase();
      const timetableRef = ref(db, `classTimetables/${id}`);
      try {
        const snapshot = await get(timetableRef);
        setLoading(false);
        if (snapshot.exists()) {
          setTimetableData(snapshot.val());
        } else {
          console.log('No data available');
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching timetable data:', error);
        setError('Error fetching timetable data: ' + error.message);
      }
    };

    fetchTimetableData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTimetableData({ ...timetableData, [name]: value });
  };

  const handleFileChange = (e) => {
    setTimetableData({ ...timetableData, pdf: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateTimetableData(timetableData);
    navigate('/showtable');
  };

  const updateTimetableData = async (data) => {
    const db = getDatabase();
    const storage = getStorage();

    const uploadFile = async (file, existingUrl) => {
      if (file) {
        const fileRef = storageRef(storage, `timetables/${file.name}`);
        const uploadTask = await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      }
      return existingUrl;
    };

    const pdfUrl = await uploadFile(data.pdf, data.pdfUrl);

    const timetableRef = ref(db, `classTimetables/${id}`);
    const updatedTimetableData = { ...data, pdfUrl };

    update(timetableRef, updatedTimetableData)
      .then(() => {
        console.log('Data updated successfully!');
        navigate('/showtable');
      })
      .catch((error) => {
        console.error('Error updating data:', error);
        setError('Error updating data: ' + error.message);
      });
  };

  return (
    <div className="add-syllabus-container">
      <form className="add-syllabus-form" onSubmit={handleSubmit}>
        <h2>Update Class Timetable</h2>
        {loading && <p className="loading-message">Loading timetable data...</p>}
        {error && <p className="error-message">{error}</p>}
        <input type="text" name="no" placeholder="No" value={timetableData.no} onChange={handleInputChange} required />
        <input type="text" name="semester" placeholder="Semester" value={timetableData.semester} onChange={handleInputChange} required />
        <input type="file" name="pdf" onChange={handleFileChange} />
        <button type="submit">Update Timetable</button>
      </form>
    </div>
  );
};

export default UpdateClassTimetable;