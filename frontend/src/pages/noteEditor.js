import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000", { transports: ["websocket"] });
export default function NoteEditor() {
  const { id } = useParams();
  // const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  let [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    // ✅ Ask for username only once per session
    let name = sessionStorage.getItem("username");
    if (!name) {
      name = prompt("Enter your name");
      sessionStorage.setItem("username", name);
    }

    // ✅ Join socket room
    socket.emit("joinNote", { noteId: id, username: name });
    socket.on("activeUsers", (users) => {
      setActiveUsers(users);
    });
    socket.on("taskAdded", (task) => {
      setTasks((prev) => [...prev, task]);
    });

    // socket.emit("addTask",'dlksal');
    // ✅ Fetch note + tasks from backend
    axios.get(`http://localhost:5000/api/notes/${id}`).then((res) => {
      setContent(res.data.content);
    });
    axios.get(`http://localhost:5000/api/tasks/${id}`).then((res) => {
      setTasks(res.data);
    });


    socket.on("taskStatusUpdated", ({ taskId, status }) =>
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status } : t))
      )
    );

    socket.on("taskUpdated", ({ taskId, ...updatedFields }) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updatedFields } : t))
      );
    });
    return () => {
      socket.off("activeUsers");
      socket.off("taskAdded");
    };
  }, [id]);

  // ✅ When note content changes
  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    socket.emit("saveNote", { noteId: id, content: newContent });
  };

  // ✅ Add new task
  const addTask = async () => {
    const res = await axios.post("http://localhost:5000/api/tasks", {
      title: newTask,
      noteId: id,
    });

    socket.emit("addTask", res.data);
    setNewTask("");

    //   try {
    //     const res = await axios.post("http://localhost:5000/api/tasks", {
    //       title: newTask,
    //       noteId: id,
    //     });

    //     const createdTask = res.data;

    //     // ✅ Update local state instantly
    //     setTasks((prev) => [...prev, createdTask]);

    //     // ✅ Emit to other connected clients
    //     socket.emit("addTask", createdTask);
    // console.log('createdTask',createdTask)
    //     // ✅ Clear input field
    //     setNewTask("");
    //   } catch (error) {
    //     console.error("Error adding task:", error);
    //   }
  };

  const updateTask = async (taskId, updatedData) => {
    await axios.put(`http://localhost:5000/api/tasks/${taskId}`, updatedData);
    // Emit to socket
    socket.emit("updateTask", { taskId, noteId: id, ...updatedData });
  };

  // When status changed
  const handleStatusChange = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  //  When "Edit" is clicked
  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setEditedTitle(task.title); // pre-fill title in input
  };

  //  When "Save" is clicked
  const handleSaveClick = (taskId) => {
    updateTask(taskId, { title: editedTitle });
    setEditingTaskId(null); // exit edit mode
    setEditedTitle("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Note Room: {id}</h2>
      <p>Active collaborators: {activeUsers.length}</p>
      <ul>
        {activeUsers.map((u) => (
          <li key={u}>{u}</li>
        ))}
      </ul>

      {/* Task section */}
      <div style={{ marginTop: 30 }}>
        <h3>Tasks for this Note</h3>
        <input
          type="text"
          value={newTask}
          placeholder="New Task"
          onChange={(e) => setNewTask(e.target.value)}
        />

        <button onClick={addTask}>Add Task</button>
        <div style={{ marginTop: "30px" }}>
          <h3 style={{ marginBottom: "10px" }}>Task List</h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ccc",
            }}
          >
            <thead style={{ backgroundColor: "#f5f5f5" }}>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Title
                </th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Status
                </th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        style={{
                          padding: "6px 8px",
                          borderRadius: "4px",
                          border: "1px solid #aaa",
                        }}
                      />
                    ) : (
                      task.title
                    )}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task.id, e.target.value)
                      }
                      style={{
                        padding: "6px 10px",
                        borderRadius: "5px",
                        border: "1px solid #aaa",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <option value="todo">To Do</option>
                      <option value="inprogress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </td>

                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {editingTaskId === task.id ? (
                      <button
                        onClick={() => handleSaveClick(task.id)}
                        style={{
                          backgroundColor: "#4caf50",
                          color: "#fff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick(task)}
                        style={{
                          backgroundColor: "#2196f3",
                          color: "#fff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
