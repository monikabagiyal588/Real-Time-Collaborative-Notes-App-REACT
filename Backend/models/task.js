const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");
const Note = require("./note.js");

const Task = sequelize.define("Task", {
  noteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Note,
      key: "id",
    },
    onDelete: "CASCADE", // ensures tasks are deleted when note is deleted
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("todo", "inprogress", "done"),
    defaultValue: "todo",
  },
});

// ✅ Define relationships (after model definition)
Note.hasMany(Task, { foreignKey: "noteId", onDelete: "CASCADE" });
Task.belongsTo(Note, { foreignKey: "noteId" });

module.exports = Task;
