import React, { useState } from 'react';
import { getDatabase, ref, set } from 'firebase/database';
import './alumini.css';

const Alumini = () => {
  const [batch, setBatch] = useState('');
  const [enrollment, setEnrollment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const db = getDatabase();
    const aluminiRef = ref(db, 'alumini/' + enrollment);

    set(aluminiRef, {
      batch,
      enrollment,
      name,
      email,
    })
      .then(() => {
        setMessage('Alumni information added successfully!');
        setBatch('');
        setEnrollment('');
        setName('');
        setEmail('');
      })
      .catch((error) => {
        setMessage('Error adding alumni information: ' + error.message);
      });
  };

  return (
    <div className="alumini-form">
      <h2>Add Alumni Information</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Batch:
          <input
            type="text"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            required
          />
        </label>
        <label>
          Enrollment No:
          <input
            type="text"
            value={enrollment}
            onChange={(e) => setEnrollment(e.target.value)}
            required
          />
        </label>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Add Alumni</button>
      </form>
    </div>
  );
};

export default Alumini;