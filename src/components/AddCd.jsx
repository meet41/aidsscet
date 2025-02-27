import React, { useState } from 'react';
import { getDatabase, ref, set } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './AddSyllabus.css';

const AddCd = () => {
  const [cdData, setCdData] = useState({
    no: '',
    year: '',
    name: '',
    file: null,
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCdData({ ...cdData, [name]: value });
  };

  const handleFileChange = (e) => {
    setCdData({ ...cdData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await writeCdData(cdData);
    navigate('/');
  };

  const writeCdData = async (data) => {
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

    const fileUrl = await uploadFile(data.file);

    const cdRef = ref(db, 'cd/' + data.no);
    const newCdData = { ...data, fileUrl };

    set(cdRef, newCdData)
      .then(() => {
        console.log('Data written successfully!');
        navigate('/');
      })
      .catch((error) => {
        console.error('Error writing data:', error);
      });
  };

  return (
    <div className="add-syllabus-container">
      <form className="add-syllabus-form" onSubmit={handleSubmit}>
        <h2>Add CD</h2>
        <input type="text" name="no" placeholder="No" value={cdData.no} onChange={handleInputChange} required />
        <input type="text" name="year" placeholder="Year" value={cdData.year} onChange={handleInputChange} required />
        <input type="text" name="name" placeholder="Name" value={cdData.name} onChange={handleInputChange} required />
        <input type="file" name="file" onChange={handleFileChange} required />
        <button type="submit">Upload CD</button>
      </form>
    </div>
  );
};

export default AddCd;