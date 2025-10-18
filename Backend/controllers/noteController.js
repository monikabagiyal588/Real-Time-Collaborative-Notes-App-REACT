import Note from '../models/Note.js';

export const getNotes = async (req, res) => {
  console.log ('monika test get note')
  const notes = await Note.findAll();
  res.json(notes);
};

export const createNotes = async (req, res) => {
  console.log ('monika test create note')
  const note = await Note.create(req.body);
  res.json(note);
};

export const updateNotes = async (req, res) => {
  console.log ('monika test update note')
  const { id } = req.params;
  await Note.update(req.body, { where: { id } });
  const updated = await Note.findByPk(id);
  res.json(updated);
};
