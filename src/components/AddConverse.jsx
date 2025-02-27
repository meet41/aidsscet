import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './AddConverse.css';

const AddConverse = () => {
  const [converseData, setConverseData] = useState({
    year: '',
    eventDate: '',
    facultyCo: '',
    studentCo: '',
    report: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [retrievedData, setRetrievedData] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConverseData({ ...converseData, [name]: value });
  };

  const handleFileChange = (e) => {
    setConverseData({ ...converseData, report: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await writeConverseData(converseData);
    navigate('/converse');
  };

  const writeConverseData = async (data) => {
    const db = getDatabase();
    const storage = getStorage();

    // Upload report to Firebase Storage
    const uploadFile = async (file) => {
      if (file) {
        const fileRef = storageRef(storage, `reports/${file.name}`);
        const uploadTask = await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      }
      return null;
    };

    const reportUrl = await uploadFile(data.report);

    // Write converse data along with the report URL to the database
    const converseRef = ref(db, 'converses/' + data.year);
    const newConverseData = { ...data, reportUrl }; // Adding the report URL to the data

    set(converseRef, newConverseData)
      .then(() => {
        console.log('Data written successfully!');
      })
      .catch((error) => {
        console.error('Error writing data:', error);
      });
  };

  const fetchConverseData = async () => {
    const db = getDatabase();
    const converseRef = ref(db, 'converses/');
    try {
      const snapshot = await get(converseRef);
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
    fetchConverseData();
  }, []);

  return (
    <div className="add-converse-form">
      <h2>Add Converse Event</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="year" placeholder="Year" value={converseData.year} onChange={handleInputChange} required />
        <input type="text" name="eventDate" placeholder="Event Date" value={converseData.eventDate} onChange={handleInputChange} required />
        <input type="text" name="facultyCo" placeholder="Faculty Coordinator" value={converseData.facultyCo} onChange={handleInputChange} required />
        <input type="text" name="studentCo" placeholder="Student Coordinator" value={converseData.studentCo} onChange={handleInputChange} required />
        <input type="file" name="report" onChange={handleFileChange} required />
        <button type="submit">Upload Converse</button>
      </form>
    </div>
  );
};

export default AddConverse;