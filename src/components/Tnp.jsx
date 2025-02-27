import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './AddSyllabus.css';

const Tnp = () => {
  const [tnpData, setTnpData] = useState({
    name: 'T&P Data', // Fixed name for TnP data
    pdf: null,
    pdfLink: '',
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [retrievedData, setRetrievedData] = useState(null);
  const [useLink, setUseLink] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTnpData({ ...tnpData, [name]: value });
  };

  const handleFileChange = (e) => {
    setTnpData({ ...tnpData, pdf: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateTnpData(tnpData);
    navigate('/');
  };

  const updateTnpData = async (data) => {
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

    const pdfUrl = useLink ? data.pdfLink : await uploadFile(data.pdf);

    const tnpRef = ref(db, 'tnp/' + data.name);
    const updatedTnpData = { ...data, pdfUrl };

    update(tnpRef, updatedTnpData)
      .then(() => {
        console.log('Data updated successfully!');
        navigate('/');
      })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
  };

  const fetchTnpData = async () => {
    const db = getDatabase();
    const tnpRef = ref(db, 'tnp/TnP');
    try {
      const snapshot = await get(tnpRef);
      if (snapshot.exists()) {
        setRetrievedData(snapshot.val());
        setTnpData(snapshot.val());
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchTnpData();
  }, []);

  return (
    <div className="add-syllabus-container">
      {isLoggedIn ? (
        <form className="add-syllabus-form" onSubmit={handleSubmit}>
          <h2>Update TNP Data</h2>
          <a href="/deletetnp">Click here to Delete TnP</a>
          <input type="text" name="name" placeholder="Name" value={tnpData.name} onChange={handleInputChange} readOnly />
          <div>
            <label>
              <input
                type="checkbox"
                checked={useLink}
                onChange={(e) => setUseLink(e.target.checked)}
              />
              Use PDF Link
            </label>
          </div>
          {useLink ? (
            <input type="text" name="pdfLink" placeholder="PDF Link" value={tnpData.pdfLink} onChange={handleInputChange} required />
          ) : (
            <input type="file" name="pdf" onChange={handleFileChange} required />
          )}
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p className="error-message">You must be logged in to update TNP data.</p>
      )}
    </div>
  );
};

export default Tnp;