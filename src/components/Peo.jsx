import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from 'firebase/database';
import MainAbout from "./MainAbout";

const PEO = () => {
  const [peoData, setPeoData] = useState('');

  useEffect(() => {
    fetchPeoData();
  }, []);

  const fetchPeoData = async () => {
    const db = getDatabase();
    const peoRef = ref(db, 'aboutus/peo');
    try {
      const snapshot = await get(peoRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setPeoData(data.textContent); // Assuming textContent contains the text data
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching PEO data:', error);
    }
  };

  return (
    <div>
      <MainAbout />
      <h2>PROGRAM EDUCATIONAL OBJECTIVES (PEO)</h2>
      {peoData ? (
        <div dangerouslySetInnerHTML={{ __html: peoData }} />
      ) : (
        <p><br />Loading PEO data...</p>
      )}
    </div>
  );
}

export default PEO;