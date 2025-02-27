import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from 'firebase/database';
import MainAbout from "./MainAbout";

const PSO = () => {
  const [psoData, setPsoData] = useState('');

  useEffect(() => {
    fetchPsoData();
  }, []);

  const fetchPsoData = async () => {
    const db = getDatabase();
    const psoRef = ref(db, 'aboutus/pso');
    try {
      const snapshot = await get(psoRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setPsoData(data.textContent); // Assuming textContent contains the text data
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching PSO data:', error);
    }
  };

  return (
    <div>
      <MainAbout />
      <h2>PROGRAM SPECIFIC OUTCOMES (PSO)</h2>
      {psoData ? (
        <div dangerouslySetInnerHTML={{ __html: psoData }} />
      ) : (
        <p><br />Loading PSO data...</p>
      )}
    </div>
  );
}

export default PSO;