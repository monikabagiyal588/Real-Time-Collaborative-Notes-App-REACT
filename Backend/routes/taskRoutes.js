const express = require('express');
const Task = require('../models/task.js');
const router = express.Router();


// Get tasks by noteId
router.get('/:noteId', async (req, res) => {
  const tasks = await Task.findAll({ where: { noteId: req.params.noteId } });
  res.json(tasks);
});

// Add new task
router.post('/', async (req, res) => {
  const { title, noteId } = req.body;
  
  const task = await Task.create({ title, noteId });
  res.json(task);
});

// Update task status
router.put('/:id', async (req, res) => {
  const { title, status } = req.body; // both fields are optional
  const updatedFields = {};

  if (title) updatedFields.title = title;
  if (status) updatedFields.status = status;
  await Task.update(updatedFields, { where: { id: req.params.id } });

  res.json({ message: 'Task updated successfully' });

});

module.exports = router;

