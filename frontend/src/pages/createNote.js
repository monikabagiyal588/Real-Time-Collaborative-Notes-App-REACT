import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateNote() {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

 
  const createNote = async () => {
    const res = await axios.post('http://localhost:5000/api/notes', { title });
    navigate(`/note/${res.data.id}`);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Create a New Note Room</h2>
      <input
        type="text"
        placeholder="Enter note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={createNote}>Create</button>
    </div>
  );
}




