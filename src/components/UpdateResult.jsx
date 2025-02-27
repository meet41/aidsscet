import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import './AddSyllabus.css';

const UpdateResult = () => {
  const { id } = useParams();
  const [resultData, setResultData] = useState({
    type: '',
    year: '',
    semester: '',
    classname: '',
    schedulePdf: null,
    seatingPdf: null,
    resultPdf: null,
    schedulePdfUrl: '',
    seatingPdfUrl: '',
    resultPdfUrl: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResultData = async () => {
      const db = getDatabase();
      const resultRef = ref(db, `results/${id}`);
      try {
        const snapshot = await get(resultRef);
        if (snapshot.exists()) {
          setResultData(snapshot.val());
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching result data:', error);
      }
    };

    fetchResultData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResultData({ ...resultData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setResultData({ ...resultData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateResultData(resultData);
    navigate('/');
  };

  const updateResultData = async (data) => {
    const db = getDatabase();
    const storage = getStorage();

    const uploadFile = async (file, existingUrl) => {
      if (file) {
        const fileRef = storageRef(storage, `results/${file.name}`);
        const uploadTask = await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      }
      return existingUrl;
    };

    const schedulePdfUrl = await uploadFile(data.schedulePdf, data.schedulePdfUrl);
    const seatingPdfUrl = await uploadFile(data.seatingPdf, data.seatingPdfUrl);
    const resultPdfUrl = await uploadFile(data.resultPdf, data.resultPdfUrl);

    const resultRef = ref(db, 'results/' + id);
    const updatedResultData = { ...data, schedulePdfUrl, seatingPdfUrl, resultPdfUrl };

    update(resultRef, updatedResultData)
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
        <h2>Update Result</h2>
        <input type="text" name="type" placeholder="Type" value={resultData.type} onChange={handleInputChange} required />
        <input type="text" name="year" placeholder="Year" value={resultData.year} onChange={handleInputChange} required />
        <input type="text" name="semester" placeholder="Semester" value={resultData.semester} onChange={handleInputChange} required />
        <input type="text" name="classname" placeholder="Classname" value={resultData.classname} onChange={handleInputChange} required />
        <input type="file" name="schedulePdf" onChange={handleFileChange} />
        <input type="file" name="seatingPdf" onChange={handleFileChange} />
        <input type="file" name="resultPdf" onChange={handleFileChange} />
        <button type="submit">Update Result</button>
      </form>
    </div>
  );
};

export default UpdateResult;