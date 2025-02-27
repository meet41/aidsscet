import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from 'firebase/database';
import MainAbout from "./MainAbout";

const Vision = () => {
  const [visionData, setVisionData] = useState('');

  useEffect(() => {
    fetchVisionData();
  }, []);

  const fetchVisionData = async () => {
    const db = getDatabase();
    const visionRef = ref(db, 'aboutus/vision');
    try {
      const snapshot = await get(visionRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setVisionData(data.textContent); // Assuming textContent contains the text data
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching vision data:', error);
    }
  };

  return (
    <div>
      <MainAbout />
      <h2>VISION</h2>
      {visionData ? (
        <div dangerouslySetInnerHTML={{ __html: visionData }} />
      ) : (
        <p><br />Loading vision data...</p>
      )}
    </div>
  );
}

export default Vision;