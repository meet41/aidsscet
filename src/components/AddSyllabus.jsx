import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './AddSyllabus.css';

const AddSyllabus = () => {
  const [syllabusData, setSyllabusData] = useState({
    semester: '',
    subcode: '',
    name: '',
    category: '',
    effective: '',
    l: 0,
    t: 0,
    p: 0,
    credit: 0,
    pdf: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [retrievedData, setRetrievedData] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSyllabusData({ ...syllabusData, [name]: value });
  };

  const handleFileChange = (e) => {
    setSyllabusData({ ...syllabusData, pdf: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await writeSyllabusData(syllabusData);
    navigate('/syllabus');
  };

  const writeSyllabusData = async (data) => {
    const db = getDatabase();
    const storage = getStorage();

    const uploadFile = async (file) => {
      if (file) {
        const fileRef = storageRef(storage, `syllabus/${file.name}`);
        const uploadTask = await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      }
      return null;
    };

    const pdfUrl = await uploadFile(data.pdf);

    const syllabusRef = ref(db, 'syllabus/' + data.subcode);
    const newSyllabusData = { ...data, pdfUrl };

    set(syllabusRef, newSyllabusData)
      .then(() => {
        console.log('Data written successfully!');
      })
      .catch((error) => {
        console.error('Error writing data:', error);
      });
  };

  const fetchSyllabusData = async () => {
    const db = getDatabase();
    const syllabusRef = ref(db, 'syllabus/');
    try {
      const snapshot = await get(syllabusRef);
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
    fetchSyllabusData();
  }, []);

  return (
    <div className="add-syllabus-container">
      <form className="add-syllabus-form" onSubmit={handleSubmit}>
        <h2>Add Syllabus</h2>
        <input type="text" name="semester" placeholder="Semester" value={syllabusData.semester} onChange={handleInputChange} required />
        <input type="text" name="subcode" placeholder="Subcode" value={syllabusData.subcode} onChange={handleInputChange} required />
        <input type="text" name="name" placeholder="Name" value={syllabusData.name} onChange={handleInputChange} required />
        <input type="text" name="category" placeholder="Category" value={syllabusData.category} onChange={handleInputChange} required />
        <input type="text" name="effective" placeholder="Effective" value={syllabusData.effective} onChange={handleInputChange} required />
        <input type="number" name="l" placeholder="L" value={syllabusData.l} onChange={handleInputChange} required />
        <input type="number" name="t" placeholder="T" value={syllabusData.t} onChange={handleInputChange} required />
        <input type="number" name="p" placeholder="P" value={syllabusData.p} onChange={handleInputChange} required />
        <input type="number" name="credit" placeholder="Credit" value={syllabusData.credit} onChange={handleInputChange} required />
        <input type="file" name="pdf" onChange={handleFileChange} required />
        <button type="submit">Upload Syllabus</button>
      </form>
    </div>
  );
};

export default AddSyllabus;
