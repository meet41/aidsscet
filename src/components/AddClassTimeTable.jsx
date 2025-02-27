import React, { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './AddClassTimeTable.css';

const AddClassTimetable = () => {
  const [no, setNo] = useState('');
  const [semester, setSemester] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const db = getDatabase();
    const timetableRef = ref(db, 'classTimetables');
    const storage = getStorage();

    if (pdfFile) {
      const storageReference = storageRef(storage, `timetables/${pdfFile.name}`);
      uploadBytes(storageReference, pdfFile)
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then((url) => {
          const newTimetable = {
            no,
            semester,
            pdfUrl: url,
          };

          return push(timetableRef, newTimetable);
        })
        .then(() => {
          setLoading(false);
          setNo('');
          setSemester('');
          setPdfFile(null);
          navigate('/showtable'); // Redirect to /showtable after successful submission
        })
        .catch((error) => {
          setLoading(false);
          setError('Error adding timetable: ' + error.message);
        });
    } else {
      setLoading(false);
      setError('Please select a PDF file.');
    }
  };

  return (
    <div className="syllabus-container">
      <h1 className="syllabus-header">Add Class Timetable</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>No:</label>
          <input
            type="text"
            value={no}
            onChange={(e) => setNo(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Semester:</label>
          <input
            type="text"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>PDF File:</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Adding...' : 'Add Timetable'}
        </button>
      </form>
    </div>
  );
};

export default AddClassTimetable;