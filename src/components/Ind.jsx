import React, { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import './ind.css';

const Ind = () => {
  const [visitDate, setVisitDate] = useState('');
  const [placeOfVisit, setPlaceOfVisit] = useState('');
  const [faculty, setFaculty] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const db = getDatabase();
    const indRef = ref(db, 'industrialVisits');
    const storage = getStorage();

    if (pdfFile) {
      const storageReference = storageRef(storage, `reports/${pdfFile.name}`);
      uploadBytes(storageReference, pdfFile)
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then((url) => {
          const newVisit = {
            visitDate,
            placeOfVisit,
            faculty,
            reportUrl: url,
          };

          return push(indRef, newVisit);
        })
        .then(() => {
          setLoading(false);
          setVisitDate('');
          setPlaceOfVisit('');
          setFaculty('');
          setPdfFile(null);
        })
        .catch((error) => {
          setLoading(false);
          setError('Error adding visit: ' + error.message);
        });
    } else {
      setLoading(false);
      setError('Please select a PDF file.');
    }
  };

  return (
    <div className="add-industrial-visit">
      <h2>Add Industrial Visit</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Visit Date:</label>
          <input
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Place of Visit:</label>
          <input
            type="text"
            value={placeOfVisit}
            onChange={(e) => setPlaceOfVisit(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Faculty:</label>
          <input
            type="text"
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Report (PDF):</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Visit'}
        </button>
      </form>
    </div>
  );
};

export default Ind;