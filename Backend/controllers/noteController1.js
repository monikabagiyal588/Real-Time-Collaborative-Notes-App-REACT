import Note from '../models/note.js'

export const getNotes = async (req, res) => {
  console.log ('monika test get note')
  const notes = await Note.findAll();
  res.json(notes);
};

export const createNotes = async (req, res) => {
  const note = await Note.create(req.body);
  res.json(note);
};

export const updateNotes = async (req, res) => {
  const { id } = req.params;
  await Note.update(req.body, { where: { id } });
  const updated = await Note.findByPk(id);
  res.json(updated);
};
// Change status
export const updateStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) return res.status(404).json({ error: "Task not found" });
    note.status = status;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
