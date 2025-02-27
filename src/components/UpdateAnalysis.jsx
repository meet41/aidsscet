import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import './AddSyllabus.css';

const UpdateAnalysis = () => {
  const { id } = useParams();
  const [analysisData, setAnalysisData] = useState({
    year: '',
    semester: '',
    pdfUrl: '',
    pdf: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalysisData = async () => {
      const db = getDatabase();
      const analysisRef = ref(db, `analysis/${id}`);
      try {
        const snapshot = await get(analysisRef);
        if (snapshot.exists()) {
          setAnalysisData(snapshot.val());
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching analysis data:', error);
      }
    };

    fetchAnalysisData();
  }, [id]);

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

    const uploadFile = async (file, existingUrl) => {
      if (file) {
        const fileRef = storageRef(storage, `analysis/${analysisData.year}/${analysisData.semester}-${file.name}`);
        await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      }
      return existingUrl;
    };

    const pdfUrl = await uploadFile(analysisData.pdf, analysisData.pdfUrl);

    const analysisRef = ref(db, `analysis/${id}`);
    const updatedAnalysisData = { ...analysisData, pdfUrl };

    update(analysisRef, updatedAnalysisData)
      .then(() => {
        console.log('Data updated successfully!');
        navigate('/showanalysis');
      })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
  };

  return (
    <div className="add-syllabus-container">
      <h1 className="syllabus-header">Update Result Analysis</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Year:</label>
          <input type="text" name="year" value={analysisData.year} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Semester:</label>
          <input type="text" name="semester" value={analysisData.semester} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Result PDF:</label>
          <input type="file" name="pdf" onChange={handleFileChange} />
        </div>
        <button type="submit" className="submit-button">Update Result</button>
      </form>
    </div>
  );
};

export default UpdateAnalysis;