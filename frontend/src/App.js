
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateNote from './pages/createNote';
import NoteEditor from './pages/noteEditor';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateNote />} />
        <Route path="/note/:id" element={<NoteEditor />} />
      </Routes>
    </BrowserRouter>
  );
}