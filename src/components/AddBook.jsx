import React, { useState } from 'react';
import { getDatabase, ref, set } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './AddSyllabus.css';

const AddBook = () => {
  const [bookData, setBookData] = useState({
    no: '',
    publication: '',
    name: '',
    year: '',
    pdf: null,
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleFileChange = (e) => {
    setBookData({ ...bookData, pdf: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await writeBookData(bookData);
    navigate('/');
  };

  const writeBookData = async (data) => {
    const db = getDatabase();
    const storage = getStorage();

    const uploadFile = async (file) => {
      if (file) {
        const fileRef = storageRef(storage, `book/${file.name}`);
        const uploadTask = await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      }
      return null;
    };

    const pdfUrl = await uploadFile(data.pdf);

    const bookRef = ref(db, 'book/' + data.no);
    const newBookData = { ...data, pdfUrl };

    set(bookRef, newBookData)
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
        <h2>Add Book</h2>
        <input type="text" name="no" placeholder="No" value={bookData.no} onChange={handleInputChange} required />
        <input type="text" name="publication" placeholder="Publication" value={bookData.publication} onChange={handleInputChange} required />
        <input type="text" name="name" placeholder="Name" value={bookData.name} onChange={handleInputChange} required />
        <input type="text" name="year" placeholder="Year" value={bookData.year} onChange={handleInputChange} required />
        <input type="file" name="pdf" onChange={handleFileChange} required />
        <button type="submit">Upload Book</button>
      </form>
    </div>
  );
};

export default AddBook;