import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from 'firebase/database';
import MainAbout from "./MainAbout";

const Mission = () => {
  const [missionData, setMissionData] = useState('');

  useEffect(() => {
    fetchMissionData();
  }, []);

  const fetchMissionData = async () => {
    const db = getDatabase();
    const missionRef = ref(db, 'aboutus/mission');
    try {
      const snapshot = await get(missionRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setMissionData(data.textContent); // Assuming textContent contains the text data
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching mission data:', error);
    }
  };

  return (
    <div>
      <MainAbout />
      <h2>MISSION</h2>
      {missionData ? (
        <div dangerouslySetInnerHTML={{ __html: missionData }} />
      ) : (
        <p><br />Loading mission data...</p>
      )}
    </div>
  );
}

export default Mission;