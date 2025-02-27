import React, { useState, useEffect } from 'react';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './ImageUploader.css';

const ImageUploader = () => {
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState('');
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

  const sanitizeFileName = (fileName) => {
    return fileName.replace(/[.#$[\]]/g, '_');
  };

  const handleUpload = () => {
    if (!imageFile || !isLoggedIn) return;

    const storage = getStorage();
    const sanitizedFileName = sanitizeFileName(imageFile.name);
    const fileRef = storageRef(storage, `images/${sanitizedFileName}`);
    const uploadTask = uploadBytesResumable(fileRef, imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
      },
      async () => {
        const url = await getDownloadURL(fileRef);
        setDownloadURL(url);
        navigate('/');
      }
    );
  };

  return (
    <div className="image-uploader-container">
      {isLoggedIn && <a href="/imagedelete">Click here to Delete Images</a>}
      <h2>Home Page Upload Image</h2>
      {!isLoggedIn && <p className="error-message">You must be logged in to upload images.</p>}
      {isLoggedIn && (
        <>
          <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
          <button onClick={handleUpload} disabled={!imageFile}>Upload</button>
          {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
        </>
      )}
    </div>
  );
};

export default ImageUploader;