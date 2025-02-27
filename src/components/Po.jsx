import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from 'firebase/database';
import MainAbout from "./MainAbout";

const PO = () => {
  const [poData, setPoData] = useState('');

  useEffect(() => {
    fetchPoData();
  }, []);

  const fetchPoData = async () => {
    const db = getDatabase();
    const poRef = ref(db, 'aboutus/po');
    try {
      const snapshot = await get(poRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setPoData(data.textContent); // Assuming textContent contains the text data
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching PO data:', error);
    }
  };

  return (
    <div>
      <MainAbout />
      <h2>PROGRAM OUTCOMES (PO)</h2>
      {poData ? (
        <div dangerouslySetInnerHTML={{ __html: poData }} />
      ) : (
        <p><br />Loading PO data...</p>
      )}
    </div>
  );
}

export default PO;