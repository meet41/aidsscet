import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, get, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './AddSyllabus.css';

const AddAnalysis = () => {
  const [analysisData, setAnalysisData] = useState({
    year: '',
    semester: '',
    pdf: null,
  });
  const [lastId, setLastId] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLastId();
  }, []);

  const fetchLastId = async () => {
    const db = getDatabase();
    const lastIdRef = ref(db, 'analysis/lastId');
    try {
      const snapshot = await get(lastIdRef);
      if (snapshot.exists()) {
        setLastId(snapshot.val());
      } else {
        setLastId(0);
      }
    } catch (error) {
      console.error('Error fetching last ID:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnalysisData({ ...analysisData, [name]: value });
  };

  const handleFileChange = (e) => {
    setAnalysisData({ ...analysisData, pdf: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getDatabase();
    const storage = getStorage();

    const uploadFile = async (file) => {
      if (file) {
        const fileRef = storageRef(storage, `analysis/${file.name}`);
        await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      }
      return null;
    };

    const pdfUrl = await uploadFile(analysisData.pdf);

    if (pdfUrl) {
      const newId = lastId + 1;
      const updates = {};
      updates[`analysis/${newId}`] = {
        no: newId,
        year: analysisData.year,
        semester: analysisData.semester,
        pdfUrl,
      };
      updates['analysis/lastId'] = newId;

      await update(ref(db), updates);

      // Reset the form
      setAnalysisData({
        year: '',
        semester: '',
        pdf: null,
      });
      navigate('/showanalysis');
    }
  };

  return (
    <div className="add-syllabus-container">
      <h1 className="syllabus-header">Add Result Analysis</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Year:</label>
          <input type="text" name="year" placeholder="Year" value={analysisData.year} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Semester:</label>
          <input type="text" name="semester" placeholder="Semester" value={analysisData.semester} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Result PDF:</label>
          <input type="file" name="pdf" onChange={handleFileChange} required />
        </div>
        <button type="submit" className="submit-button">Add Result</button>
      </form>
    </div>
  );
};

export default AddAnalysis;