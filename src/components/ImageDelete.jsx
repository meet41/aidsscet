import React, { useState, useEffect } from 'react';
import { getStorage, ref as storageRef, listAll, deleteObject, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './ImageDelete.css';

const ImageDelete = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchImages();
      } else {
        setIsAuthenticated(false);
      }
    });
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    
    const storage = getStorage();
    const imagesRef = storageRef(storage, 'images/');

    try {
      const result = await listAll(imagesRef);
      const urls = await Promise.all(result.items.map(itemRef => getDownloadURL(itemRef)));
      setImages(urls);
    } catch (error) {
      setError('Error fetching images: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (url) => {
    const storage = getStorage();
    const imageRef = storageRef(storage, url);

    try {
      await deleteObject(imageRef);
      setImages(images.filter(image => image !== url));
    } catch (error) {
      setError('Error deleting image: ' + error.message);
    }
  };

  return (
    <div className="image-list-container">
      <h2>Image List</h2>
      {loading && <p className="loading-message">Loading images...</p>}
      {error && <p className="error-message">{error}</p>}
      {!isAuthenticated && <p className="error-message">User is not authenticated. Please log in to see the images and delete options.</p>}
      {isAuthenticated && images.length > 0 ? (
        <table className="image-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {images.map((url, index) => (
              <tr key={index}>
                <td><img src={url} alt={`Image ${index}`} className="image-thumbnail" /></td>
                <td><button onClick={() => handleDelete(url)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        isAuthenticated && !loading && <p>No images found.</p>
      )}
    </div>
  );
};

export default ImageDelete;