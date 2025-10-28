const express = require('express');
const Note = require('../models/note.js');
const router = express.Router();

// Create new note
router.post('/', async (req, res) => {
  const { title } = req.body;
  const note = await Note.create({ title });
  res.json(note);
});

// Get note by ID
router.get('/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

// Update note content
// router.put('/:id', async (req, res) => {
//   const note = await Note.findByPk(req.params.id);
//   if (!note) return res.status(404).json({ error: 'Note not found' });
//   note.updatedAt = new Date();
//   await note.save();
//   res.json(note);
// });

module.exports = router;
