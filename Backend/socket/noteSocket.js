import Note from '../models/Note.js';
const activeUsers = {};
const typingUsers = {}; 
const noteContents = {}; 

export default (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User joins note
    socket.on("joinNote",async ({ noteId, username }) => {
      socket.join(noteId);
      socket.noteId = noteId;
      socket.username = username;

      // Track active users
      if (!activeUsers[noteId]) activeUsers[noteId] = [];
      if (!activeUsers[noteId].includes(username))
        activeUsers[noteId].push(username);

      if (!noteContents[noteId]) noteContents[noteId] = ""; 

       //  Load note from DB or create if not exists
      let note = await Note.findByPk(noteId);
      if (!note) {
        note = await Note.create({ note_id: noteId, content: '' });
      }
      noteContents[noteId] = note.content;


      // Send current content to the newly joined user
      console.log(`Sending content to ${username}:`, noteContents[noteId]);
      socket.emit("loadNote", noteContents[noteId] || "");

      // Notify others
      socket.to(noteId).emit("userJoined", `${username} joined the note `);

      // Update user list for everyone
      io.to(noteId).emit("userList", activeUsers[noteId]);
    });

    socket.on("editNote", async ({ noteId, content }) => {
   
      noteContents[noteId] = content;

       // Update DB
      await Note.update({ content }, { where: { note_id: noteId } });

      // Send update to all other users in the same note
      socket.to(noteId).emit("noteUpdated", content);
    });

    // Typing indicator
    socket.on("typing", ({ noteId, username, isTyping }) => {
      if (!typingUsers[noteId]) typingUsers[noteId] = {};
      typingUsers[noteId][username] = isTyping;

      const typingList = Object.keys(typingUsers[noteId]).filter(
        (u) => typingUsers[noteId][u]
      );

      io.to(noteId).emit("typingUsers", typingList);

      setTimeout(() => {
        if (typingUsers[noteId]) {
          delete typingUsers[noteId][username];
          io.to(noteId).emit("typingUsers", Object.keys(typingUsers[noteId]));
        }
      }, 1500);
    });

    // When user leaves 
    socket.on("leaveNote", ({ noteId, username }) => {
      socket.leave(noteId);

      if (activeUsers[noteId]) {
        activeUsers[noteId] = activeUsers[noteId].filter((u) => u !== username);
        io.to(noteId).emit("userList", activeUsers[noteId]);
      }

      if (typingUsers[noteId]) {
        delete typingUsers[noteId][username];
        io.to(noteId).emit("typingUsers", Object.keys(typingUsers[noteId]));
      }

      socket.to(noteId).emit("userLeft", `${username} left the note `);
    });

    // When user disconnects 
    socket.on("disconnect", () => {
      const { noteId, username } = socket;
      if (noteId && username && activeUsers[noteId]) {
        activeUsers[noteId] = activeUsers[noteId].filter((u) => u !== username);
        io.to(noteId).emit("userList", activeUsers[noteId]);
        socket.to(noteId).emit("userLeft", `${username} left the note `);
      }

      console.log("User disconnected:", socket.id);
    });
  });
};
