import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from 'firebase/database';
import MainAbout from "./MainAbout";

const Message = () => {
  const [messageData, setMessageData] = useState('');

  useEffect(() => {
    fetchMessageData();
  }, []);

  const fetchMessageData = async () => {
    const db = getDatabase();
    const messageRef = ref(db, 'aboutus/message');
    try {
      const snapshot = await get(messageRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setMessageData(data.textContent); // Assuming textContent contains the text data
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching message data:', error);
    }
  };

  return (
    <div>
      <MainAbout />
      <h2>MESSAGE</h2>
      {messageData ? (
        <div dangerouslySetInnerHTML={{ __html: messageData }} />
      ) : (
        <p><br />Loading message data...</p>
      )}
    </div>
  );
}

export default Message;