import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './AddAthletics.css';

const AddAthletics = () => {
  const [athleticEventData, setAthleticEventData] = useState({
    eventDate: '',
    facultyCo: '',
    pdf: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [retrievedData, setRetrievedData] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAthleticEventData({ ...athleticEventData, [name]: value });
  };

  const handleFileChange = (e) => {
    setAthleticEventData({ ...athleticEventData, pdf: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await writeAthleticEventData(athleticEventData);
    navigate('/showathletics');
  };

  const writeAthleticEventData = async (data) => {
    const db = getDatabase();
    const storage = getStorage();

    const uploadFile = async (file) => {
      if (file) {
        const fileRef = storageRef(storage, `athletics/${file.name}`);
        const uploadTask = await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      }
      return null;
    };

    const pdfUrl = await uploadFile(data.pdf);

    const athleticEventRef = ref(db, 'athleticEvents/' + data.eventDate);
    const newAthleticEventData = { ...data, pdfUrl };

    set(athleticEventRef, newAthleticEventData)
      .then(() => {
        console.log('Data written successfully!');
      })
      .catch((error) => {
        console.error('Error writing data:', error);
      });
  };

  const fetchAthleticEventData = async () => {
    const db = getDatabase();
    const athleticEventsRef = ref(db, 'athleticEvents/');
    try {
      const snapshot = await get(athleticEventsRef);
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
    fetchAthleticEventData();
  }, []);

  return (
    <div className="add-athletic-event-container">
      <form className="add-athletic-event-form" onSubmit={handleSubmit}>
        <h2>Add Athletics</h2>
        <input type="date" name="eventDate" placeholder="Event Date" value={athleticEventData.eventDate} onChange={handleInputChange} required />
        <input type="text" name="facultyCo" placeholder="Faculty Coordinator" value={athleticEventData.facultyCo} onChange={handleInputChange} required />
        <input type="file" name="pdf" onChange={handleFileChange} required />
        <button type="submit">Upload Athletic Event</button>
      </form>
    </div>
  );
};

export default AddAthletics;