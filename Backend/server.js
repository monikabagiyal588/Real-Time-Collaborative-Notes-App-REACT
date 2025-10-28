const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const sequelize = require('./config/db.js');
const Note = require('./models/note.js');
const noteRoutes = require('./routes/noteRoute.js');
const taskRoutes = require('./routes/taskRoutes.js');
const Task = require('./models/task.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/notes', noteRoutes);
app.use('/api/tasks', taskRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const activeUsers = {}; // { noteId: Set of usernames }

// SOCKET LOGIC
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ✅ Join a note room
  socket.on("joinNote", ({ noteId, username }) => {
    socket.join(noteId);
    socket.username = username; // store username on socket
    if (!activeUsers[noteId]) activeUsers[noteId] = new Set();
    activeUsers[noteId].add(username);
    console.log('activeUsers',activeUsers)
    io.to(noteId).emit("activeUsers", Array.from(activeUsers[noteId]));

  });
  // Add task event
  socket.on("addTask", (task) => {
    io.to(task.noteId).emit("taskAdded", task);
  });
  // ✅ Save note to DB
  socket.on("saveNote", async ({ noteId, content }) => {
    await Note.update({ content, updatedAt: new Date() }, { where: { id: noteId } });
  });
   //  Update task
  socket.on("updateTask", async ({ noteId, taskId, title, status }) => {
  const updatedFields = {};
  if (title) updatedFields.title = title;
  if (status) updatedFields.status = status;

  // Emit event to all users in that note
  io.to(noteId).emit("taskUpdated", { taskId, ...updatedFields });
});

  // ✅ Handle user disconnect
  socket.on("disconnecting", () => {
    for (const noteId of socket.rooms) {
      if (activeUsers[noteId]) {
        activeUsers[noteId].delete(socket.username);
        io.to(noteId).emit("activeUsers", Array.from(activeUsers[noteId]));
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

sequelize.sync().then(() => {
  server.listen(5000, () => console.log('Server running on port 5000'));
});
