import React, { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { fetchResultsByType } from '../firebase';
import './AddResult.css';

function AddResult() {
  const [type, setType] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [classname, setClassname] = useState('');
  const [resultType, setResultType] = useState('');
  const [resultSubType, setResultSubType] = useState('');
  const [schedulePdf, setSchedulePdf] = useState(null);
  const [seatingPdf, setSeatingPdf] = useState(null);
  const [resultPdf, setResultPdf] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getDatabase();
    const storage = getStorage();

    const uploadFile = async (file) => {
      if (file) {
        const fileRef = storageRef(storage, `results/${file.name}`);
        await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      }
      return null;
    };

    const schedulePdfUrl = await uploadFile(schedulePdf);
    const seatingPdfUrl = await uploadFile(seatingPdf);
    const resultPdfUrl = await uploadFile(resultPdf);

    const resultData = {
      type,
      year,
      semester,
      classname,
      resultType,
      resultSubType,
      schedulePdfUrl,
      seatingPdfUrl,
      resultPdfUrl,
    };

    const resultsRef = ref(db, 'results');
    await push(resultsRef, resultData);

    // Reset the form
    setType('');
    setYear('');
    setSemester('');
    setClassname('');
    setResultType('');
    setResultSubType('');
    setSchedulePdf(null);
    setSeatingPdf(null);
    setResultPdf(null);
    navigate('/results');
  };

  // Usage example
  fetchResultsByType('Summer').then((data) => {
    console.log(data);
  });

  return (
    <div className="add-result-container">
      <h2 className="add-result-header">Add New Result</h2>
      <form className="add-result-form" onSubmit={handleSubmit}>
        <div>
          <label>Type:</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Year:</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Semester:</label>
          <input
            type="text"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Classname:</label>
          <input
            type="text"
            value={classname}
            onChange={(e) => setClassname(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Result Type:</label>
          <select value={resultType} onChange={(e) => setResultType(e.target.value)} required>
            <option value="">Select</option>
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
          </select>
        </div>
        <div>
          <label>Result Sub-Type:</label>
          <select value={resultSubType} onChange={(e) => setResultSubType(e.target.value)} required>
            <option value="">Select</option>
            <option value="Regular">Regular</option>
            <option value="Backlog">Backlog</option>
          </select>
        </div>
        <div>
          <label>Schedule PDF:</label>
          <input type="file" onChange={(e) => handleFileChange(e, setSchedulePdf)} />
        </div>
        <div>
          <label>Seating PDF:</label>
          <input type="file" onChange={(e) => handleFileChange(e, setSeatingPdf)} />
        </div>
        <div>
          <label>Result PDF:</label>
          <input type="file" onChange={(e) => handleFileChange(e, setResultPdf)} />
        </div>
        <button type="submit">Add Result</button>
      </form>
    </div>
  );
}

export default AddResult;