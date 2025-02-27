import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, get, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './AddSyllabus.css';

const Library = () => {
  const [libraryData, setLibraryData] = useState({
    name: 'Library Manual', // Default to Library Manual
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
    setLibraryData({ ...libraryData, [name]: value });
  };

  const handleFileChange = (e) => {
    setLibraryData({ ...libraryData, pdf: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await writeLibraryData(libraryData);
    navigate('/');
  };

  const writeLibraryData = async (data) => {
    const db = getDatabase();
    const storage = getStorage();

    const uploadFile = async (file) => {
      if (file) {
        const fileRef = storageRef(storage, `library/${file.name}`);
        const uploadTask = await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      }
      return null;
    };

    const pdfUrl = useLink ? data.pdfLink : await uploadFile(data.pdf);

    const libraryRef = ref(db, 'library/' + data.name);
    const newLibraryData = { ...data, pdfUrl };

    get(libraryRef).then((snapshot) => {
      if (snapshot.exists()) {
        update(libraryRef, newLibraryData)
          .then(() => {
            console.log('Data updated successfully!');
            navigate('/');
          })
          .catch((error) => {
            console.error('Error updating data:', error);
          });
      } else {
        set(libraryRef, newLibraryData)
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

  const fetchLibraryData = async () => {
    const db = getDatabase();
    const libraryRef = ref(db, 'library/');
    try {
      const snapshot = await get(libraryRef);
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
    fetchLibraryData();
  }, []);

  return (
    <div className="add-syllabus-container">
      {isLoggedIn ? (
        <form className="add-syllabus-form" onSubmit={handleSubmit}>
          <h2>Update Library Data</h2>
          <label>
            Select Document:
            <select name="name" value={libraryData.name} onChange={handleInputChange}>
              <option value="Library Manual">Library Manual</option>
              <option value="Book Consolidated">Book Consolidated</option>
            </select>
          </label>
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
            <input type="text" name="pdfLink" placeholder="PDF Link" value={libraryData.pdfLink} onChange={handleInputChange} required />
          ) : (
            <input type="file" name="pdf" onChange={handleFileChange} required />
          )}
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p className="error-message">You must be logged in to update Library data.</p>
      )}
    </div>
  );
};

export default Library;