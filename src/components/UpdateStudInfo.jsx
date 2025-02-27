import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import { useNavigate, useParams } from 'react-router-dom';
import './AddSyllabus.css';

const UpdateStudInfo = () => {
  const { id } = useParams();
  const [studentData, setStudentData] = useState({
    batchType: '',
    enrollmentNo: '',
    name: '',
    email: '',
    year: '',
    achievement: '',
    iep: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      setError(null);

      const db = getDatabase();
      const studInfoRef = ref(db, `studentInfo/${id}`);
      try {
        const snapshot = await get(studInfoRef);
        setLoading(false);
        if (snapshot.exists()) {
          setStudentData(snapshot.val());
        } else {
          console.log('No data available');
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching student data:', error);
        setError('Error fetching student data: ' + error.message);
      }
    };

    fetchStudentData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getDatabase();
    const studInfoRef = ref(db, `studentInfo/${id}`);

    update(studInfoRef, studentData)
      .then(() => {
        console.log('Data updated successfully!');
        navigate('/studinfo');
      })
      .catch((error) => {
        console.error('Error updating data:', error);
        setError('Error updating data: ' + error.message);
      });
  };

  return (
    <div className="add-syllabus-container">
      <h1 className="syllabus-header">Update Student Info</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Batch Type:</label>
          <input type="text" name="batchType" value={studentData.batchType} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Enrollment No:</label>
          <input type="text" name="enrollmentNo" value={studentData.enrollmentNo} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={studentData.name} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={studentData.email} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Year:</label>
          <input type="text" name="year" value={studentData.year} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Achievement:</label>
          <input type="text" name="achievement" value={studentData.achievement} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>IEP:</label>
          <input type="text" name="iep" value={studentData.iep} onChange={handleInputChange} required />
        </div>
        <button type="submit" className="submit-button">Update Info</button>
      </form>
    </div>
  );
};

export default UpdateStudInfo;