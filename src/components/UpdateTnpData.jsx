import React, { useState, useEffect } from 'react';
import { getDatabase, ref, update, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import './AddSyllabus.css';

const UpdateTnpData = () => {
  const { id } = useParams();
  const [bookData, setBookData] = useState({
    no: '',
    semester: '',
    name: '',
    year: '',
    pdf: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookData = async () => {
      const db = getDatabase();
      const bookRef = ref(db, `tnp/${id}`);
      try {
        const snapshot = await get(bookRef);
        if (snapshot.exists()) {
          setBookData(snapshot.val());
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching book data:', error);
      }
    };

    fetchBookData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleFileChange = (e) => {
    setBookData({ ...bookData, pdf: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateBookData(bookData);
    navigate('/');
  };

  const updateBookData = async (data) => {
    const db = getDatabase();
    const storage = getStorage();

    const uploadFile = async (file) => {
      if (file) {
        const fileRef = storageRef(storage, `tnp/${file.name}`);
        const uploadTask = await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      }
      return null;
    };

    const pdfUrl = data.pdf ? await uploadFile(data.pdf) : data.pdfUrl;

    const bookRef = ref(db, 'tnp/' + data.no);
    const updatedBookData = { ...data, pdfUrl };

    update(bookRef, updatedBookData)
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
        <h2>Update Book</h2>
        <input type="text" name="no" placeholder="No" value={bookData.no} onChange={handleInputChange} required />
        <input type="text" name="semester" placeholder="semester" value={bookData.semester} onChange={handleInputChange} required />
        <input type="text" name="name" placeholder="Name" value={bookData.name} onChange={handleInputChange} required />
        <input type="text" name="year" placeholder="Year" value={bookData.year} onChange={handleInputChange} required />
        <input type="file" name="pdf" onChange={handleFileChange} />
        <button type="submit">Update Book</button>
      </form>
    </div>
  );
};

export default UpdateTnpData;