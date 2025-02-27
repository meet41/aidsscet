import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, get, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/webpack';
import mammoth from 'mammoth';
import './AddSyllabus.css';

// Set the workerSrc property
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const UpdateAbout = () => {
  const [aboutUsData, setAboutUsData] = useState({
    section: '',
    file: null,
    fileLink: '',
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
    setAboutUsData({ ...aboutUsData, [name]: value });
  };

  const handleFileChange = (e) => {
    setAboutUsData({ ...aboutUsData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await writeAboutUsData(aboutUsData);
    navigate('/');
  };

  const extractTextFromFile = async (file) => {
    const fileType = file.type;
    if (fileType === 'application/pdf') {
      return extractTextFromPdf(file);
    } else if (fileType === 'text/plain') {
      return extractTextFromTxt(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      return extractTextFromPpt(file);
    } else {
      throw new Error('Unsupported file type');
    }
  };

  const extractTextFromPdf = async (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const pdf = await pdfjsLib.getDocument({ data: reader.result }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map(item => item.str).join(' ');
          text += `${pageText}\n`;
        }
        resolve(text.trim());
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const extractTextFromTxt = async (file) => {
    const reader = new FileReader();
    reader.readAsText(file);
    return new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result.trim());
      reader.onerror = (error) => reject(error);
    });
  };

  const extractTextFromPpt = async (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const arrayBuffer = reader.result;
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value.trim());
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const writeAboutUsData = async (data) => {
    const db = getDatabase();
    const storage = getStorage();

    const uploadFile = async (file) => {
      if (file) {
        const fileRef = storageRef(storage, `aboutus/${data.section}/${file.name}`);
        const uploadTask = await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      }
      return null;
    };

    const fileUrl = useLink ? data.fileLink : await uploadFile(data.file);
    const textContent = data.file ? await extractTextFromFile(data.file) : '';

    const aboutUsRef = ref(db, 'aboutus/' + data.section);
    const newAboutUsData = { ...data, fileUrl, textContent };

    get(aboutUsRef).then((snapshot) => {
      if (snapshot.exists()) {
        update(aboutUsRef, newAboutUsData)
          .then(() => {
            console.log('Data updated successfully!');
            navigate('/');
          })
          .catch((error) => {
            console.error('Error updating data:', error);
          });
      } else {
        set(aboutUsRef, newAboutUsData)
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

  const fetchAboutUsData = async () => {
    const db = getDatabase();
    const aboutUsRef = ref(db, 'aboutus/');
    try {
      const snapshot = await get(aboutUsRef);
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
    fetchAboutUsData();
  }, []);

  return (
    <div className="add-syllabus-container">
      {isLoggedIn ? (
        <form className="add-syllabus-form" onSubmit={handleSubmit}>
          <h2>Upload About Us Data</h2>
          <a href="/deleteabout">Click here to Delete About</a>
          <select name="section" value={aboutUsData.section} onChange={handleInputChange} required>
            <option value="">Select Section</option>
            <option value="about-dept">About Dept</option>
            <option value="message">Message</option>
            <option value="vision">Vision</option>
            <option value="mission">Mission</option>
            <option value="pso">PSO</option>
            <option value="po">PO</option>
            <option value="peo">PEO</option>
          </select>
          <div>
            <label>
              <input
                type="checkbox"
                checked={useLink}
                onChange={(e) => setUseLink(e.target.checked)}
              />
              Use File Link
            </label>
          </div>
          {useLink ? (
            <input type="text" name="fileLink" placeholder="File Link" value={aboutUsData.fileLink} onChange={handleInputChange} required />
          ) : (
            <input type="file" name="file" onChange={handleFileChange} required />
          )}
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p className="error-message">You must be logged in to upload data.</p>
      )}
    </div>
  );
};

export default UpdateAbout;