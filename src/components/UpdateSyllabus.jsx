import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import './AddSyllabus.css';

const UpdateSyllabus = () => {
  const { id } = useParams();
  const [syllabusData, setSyllabusData] = useState({
    subcode: '',
    name: '',
    category: '',
    effective: '',
    l: '',
    t: '',
    p: '',
    credit: '',
    pdf: null,
    pdfUrl: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSyllabusData = async () => {
      const db = getDatabase();
      const syllabusRef = ref(db, `syllabus/${id}`);
      try {
        const snapshot = await get(syllabusRef);
        if (snapshot.exists()) {
          setSyllabusData(snapshot.val());
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching syllabus data:', error);
      }
    };

    fetchSyllabusData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSyllabusData({ ...syllabusData, [name]: value });
  };

  const handleFileChange = (e) => {
    setSyllabusData({ ...syllabusData, pdf: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSyllabusData(syllabusData);
    navigate('/');
  };

  const updateSyllabusData = async (data) => {
    const db = getDatabase();
    const storage = getStorage();

    const uploadFile = async (file, existingUrl) => {
      if (file) {
        const fileRef = storageRef(storage, `syllabus/${file.name}`);
        const uploadTask = await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      }
      return existingUrl;
    };

    const pdfUrl = await uploadFile(data.pdf, data.pdfUrl);

    const syllabusRef = ref(db, 'syllabus/' + id);
    const updatedSyllabusData = { ...data, pdfUrl };

    update(syllabusRef, updatedSyllabusData)
      .then(() => {
        console.log('Data updated successfully!');
        navigate('/');
      })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
  };

  return (
    <div className="add-syllabus-container">
      <form className="add-syllabus-form" onSubmit={handleSubmit}>
        <h2>Update Syllabus</h2>
        <input type="text" name="subcode" placeholder="Subcode" value={syllabusData.subcode} onChange={handleInputChange} required />
        <input type="text" name="name" placeholder="Name" value={syllabusData.name} onChange={handleInputChange} required />
        <input type="text" name="category" placeholder="Category" value={syllabusData.category} onChange={handleInputChange} required />
        <input type="text" name="effective" placeholder="Effective" value={syllabusData.effective} onChange={handleInputChange} required />
        <input type="text" name="l" placeholder="L" value={syllabusData.l} onChange={handleInputChange} required />
        <input type="text" name="t" placeholder="T" value={syllabusData.t} onChange={handleInputChange} required />
        <input type="text" name="p" placeholder="P" value={syllabusData.p} onChange={handleInputChange} required />
        <input type="text" name="credit" placeholder="Credit" value={syllabusData.credit} onChange={handleInputChange} required />
        <input type="file" name="pdf" onChange={handleFileChange} />
        <button type="submit">Update Syllabus</button>
      </form>
    </div>
  );
};

export default UpdateSyllabus;