import React, { useState, useEffect } from 'react';
import { getDatabase, ref, update, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import './AddSyllabus.css';

const UpdateCd = () => {
  const { id } = useParams();
  const [cdData, setCdData] = useState({
    no: '',
    year: '',
    name: '',
    file: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCdData = async () => {
      const db = getDatabase();
      const cdRef = ref(db, `cd/${id}`);
      try {
        const snapshot = await get(cdRef);
        if (snapshot.exists()) {
          setCdData(snapshot.val());
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching CD data:', error);
      }
    };

    fetchCdData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCdData({ ...cdData, [name]: value });
  };

  const handleFileChange = (e) => {
    setCdData({ ...cdData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateCdData(cdData);
    navigate('/');
  };

  const updateCdData = async (data) => {
    const db = getDatabase();
    const storage = getStorage();

    const uploadFile = async (file) => {
      if (file) {
        const fileRef = storageRef(storage, `cd/${file.name}`);
        const uploadTask = await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      }
      return null;
    };

    const fileUrl = data.file ? await uploadFile(data.file) : data.fileUrl;

    const cdRef = ref(db, 'cd/' + data.no);
    const updatedCdData = { ...data, fileUrl };

    update(cdRef, updatedCdData)
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
        <h2>Update CD</h2>
        <input type="text" name="no" placeholder="No" value={cdData.no} onChange={handleInputChange} required />
        <input type="text" name="year" placeholder="Year" value={cdData.year} onChange={handleInputChange} required />
        <input type="text" name="name" placeholder="Name" value={cdData.name} onChange={handleInputChange} required />
        <input type="file" name="file" onChange={handleFileChange} />
        <button type="submit">Update CD</button>
      </form>
    </div>
  );
};

export default UpdateCd;