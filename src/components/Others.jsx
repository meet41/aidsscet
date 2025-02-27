import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, get, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './AddSyllabus.css';

const Others = () => {
  const [othersData, setOthersData] = useState({
    name: '',
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
    setOthersData({ ...othersData, [name]: value });
  };

  const handleFileChange = (e) => {
    setOthersData({ ...othersData, pdf: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await writeOthersData(othersData);
    navigate('/');
  };

  const writeOthersData = async (data) => {
    const db = getDatabase();
    const storage = getStorage();

    const uploadFile = async (file) => {
      if (file) {
        const fileRef = storageRef(storage, `others/${file.name}`);
        const uploadTask = await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      }
      return null;
    };

    const pdfUrl = useLink ? data.pdfLink : await uploadFile(data.pdf);

    const othersRef = ref(db, 'others/' + data.name);
    const newOthersData = { ...data, pdfUrl };

    get(othersRef).then((snapshot) => {
      if (snapshot.exists()) {
        update(othersRef, newOthersData)
          .then(() => {
            console.log('Data updated successfully!');
            navigate('/');
          })
          .catch((error) => {
            console.error('Error updating data:', error);
          });
      } else {
        set(othersRef, newOthersData)
          .then(() => {
            console.log('Data written successfully!');
            navigate('/');
          })
          .catch((error) => {
            console.error('Error writing data:', error);
          });
      }
    }).catch((error) => {
      console.error('Error checking data:', error);
    });
  };

  const fetchOthersData = async () => {
    const db = getDatabase();
    const othersRef = ref(db, 'others/');
    try {
      const snapshot = await get(othersRef);
      if (snapshot.exists()) {
        setRetrievedData(snapshot.val());
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchOthersData();
  }, []);

  return (
    <div className="add-syllabus-container">
      {isLoggedIn ? (
        <form className="add-syllabus-form" onSubmit={handleSubmit}>
          <a href="/othersdelete">Click here to delete Quick Links</a>
          <h2>Add Quick Links</h2>
          <input type="text" name="name" placeholder="Name" value={othersData.name} onChange={handleInputChange} required />
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
            <input type="text" name="pdfLink" placeholder="PDF Link" value={othersData.pdfLink} onChange={handleInputChange} required />
          ) : (
            <input type="file" name="pdf" onChange={handleFileChange} required />
          )}
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p className="error-message">You must be logged in to add quick links.</p>
      )}
    </div>
  );
};

export default Others;