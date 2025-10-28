// import React, { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";

// export default function NoteEditor() {
//   const [noteId, setNoteId] = useState("");
//   const [username, setUsername] = useState("");
//   const [joined, setJoined] = useState(false);
//   const [tasks, setTasks] = useState([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [users, setUsers] = useState([]);
//   const [typingUsers, setTypingUsers] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const socketRef = useRef(null);
//   //  const [content, setContent] = useState("");

//   const joinNote = () => {
//     if (!noteId || !username) {
//       alert("Please enter Note ID and Username");
//       return;
//     }

//     socketRef.current = io("http://localhost:5000", {
//       transports: ["websocket"],
//     });

//     socketRef.current.on("connect", () => {
//       console.log("✅ Socket connected:", socketRef.current.id);
//     });

//     socketRef.current.emit("joinNote", { noteId, username });

//     socketRef.current.on("loadNote", (existingContent) => {
//       // setContent(existingContent);
//     });

//     socketRef.current.on("noteUpdated", (newContent) => {
//       // setContent(newContent);
//     });

//     socketRef.current.on("userList", (activeUsers) => {
//       setUsers(activeUsers);
//     });

//     socketRef.current.on("typingUsers", (list) => {
//       setTypingUsers(list.filter((u) => u !== username));
//     });

//   // socket.on("taskStatusChanged", (task) =>
//   //     setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
//   //   );

//     //  User join notification
//     socketRef.current.on("userJoined", (message) => {
//       showNotification(message, "join");
//     });

//     //  User leave notification
//     socketRef.current.on("userLeft", (message) => {
//       showNotification(message, "leave");
//     });

//     setJoined(true);
//   };

//   const showNotification = (message, type) => {
//     const id = Date.now();
//     setNotifications((prev) => [...prev, { id, message, type }]);
//     setTimeout(() => {
//       setNotifications((prev) => prev.filter((n) => n.id !== id));
//     }, 3000);
//   };

//   // const handleChange = (e) => {
//   //   const newValue = e.target.value;
//   //   setContent(newValue);
//   //   socketRef.current.emit("editNote", { noteId, content: newValue });
//   //   socketRef.current.emit("typing", { noteId, username });
//   // };

//     const addTask = () => {
//     socketRef.current.emit("addTask", { noteId, title, description });
//     setTitle(""); setDescription("");
//   };
// // useEffect(() => {
// //   socketRef.current = io("http://localhost:5000");
// //   socketRef.current.emit("joinNote", { noteId, username });

// //   return () => socketRef.current.disconnect();
// // }, [noteId]);

//   useEffect(() => {

//      socketRef.current.emit("joinNote", { noteId, username });
//    socketRef.current.on("loadTasks", (t) => setTasks(t));
//    socketRef.current.on("taskAdded", (task) => setTasks((prev) => [...prev, task]));
//    socketRef.current.on("taskUpdated", (task) =>
//       setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
//     );
//     socketRef.current.on("taskStatusChanged", (task) =>
//       setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
//     );
//     return () => {
//       if (socketRef.current) socketRef.current.disconnect();
//     };
//   }, [noteId]);

//     const changeStatus = (taskId, status) => {
//     socketRef.current.emit("changeStatus", { taskId, status });
//   };

//   if (!joined) {
//     return (
//       <div style={{ padding: 20 }}>
//         <h2>Join a Note</h2>
//         <input
//           placeholder="Note ID"
//           value={noteId}
//           onChange={(e) => setNoteId(e.target.value)}
//           style={{ marginRight: 10 }}
//         />
//         <input
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           style={{ marginRight: 10 }}
//         />
//         <button onClick={joinNote}>Join Note</button>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: 20, position: "relative" }}>
//       <h3>Collaborative Note: {noteId}</h3>
//        <ul>
//         {users.map((user, index) => (
//           <li
//             key={index}
//             style={{
//               fontWeight: user === username ? "bold" : "normal",
//               color: user === username ? "black" : "black",
//             }}
//           >
//             {user}
//           </li>
//         ))}
//       </ul>

//       {/* <textarea
//         style={{ width: "100%", height: 300 }}
//         value={content}
//         onChange={handleChange}
//       /> */}
//        <div>
//       <h3>Tasks</h3>
//       <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title"/>
//       <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"/>
//       <button onClick={addTask}>Add Task</button>

//       <ul>
//         {tasks.map((task) => (
//           <li key={task.id}>
//             <b>{task.title}</b> ({task.status})
//             <button onClick={() => changeStatus(task.id, "In Progress")}>In Progress</button>
//             <button onClick={() => changeStatus(task.id, "Done")}>Done</button>
//           </li>
//         ))}
//       </ul>
//     </div>

//       {typingUsers.length > 0 && (
//         <p style={{ color: "gray" }}>
//           {typingUsers.join(", ")} is typing.....
//         </p>
//       )}

//       {/* Notification messages */}
//       <div
//         style={{
//           position: "fixed",
//           top: 20,
//           right: 20,
//           display: "flex",
//           flexDirection: "column",
//           gap: "10px",
//           zIndex: 9999,
//         }}
//       >
//         {notifications.map((n) => (
//           <div
//             key={n.id}
//             style={{
//               backgroundColor: n.type === "join" ? "#d4edda" : "#f8d7da",
//               color: n.type === "join" ? "#155724" : "#721c24",
//               padding: "10px 16px",
//               borderRadius: 8,
//               boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//               fontSize: 14,
//               animation: "fadeIn 0.3s",
//             }}
//           >
//             {n.message}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

export default function NoteEditor() {
  const [noteId, setNoteId] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  
   const [taskId, setTaskId] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState("");
  const [status, setStatus] = useState("To Do"); 
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  // 🔹 Join Note (initial connection)
  const joinNote = () => {
    if (!noteId || !username) {
      alert("Please enter Note ID and Username");
      return;
    }

    // Initialize socket
    if (!socketRef.current) {
    socketRef.current = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Connected to server:", socketRef.current.id);
      socketRef.current.emit("joinNote", { noteId, username }); // ✅ Join immediately
    });
  } else {
    socketRef.current.emit("joinNote", { noteId, username });
  }
    // Emit join event
    socketRef.current.emit("joinNote", { noteId, username });
 socketRef.current.on("loadNote", (existingContent) => {
 
      setContent(existingContent);
    });
     socketRef.current.on("noteUpdated", (newContent) => {
      alert('update');
      setContent(newContent);
    });
    // Handle users and notifications
    socketRef.current.on("userList", (activeUsers) => setUsers(activeUsers));
    socketRef.current.on("typingUsers", (list) =>
      setTypingUsers(list.filter((u) => u !== username))
    );
    socketRef.current.on("userJoined", (message) =>
      showNotification(message, "join")
    );
    socketRef.current.on("userLeft", (message) =>
      showNotification(message, "leave")
    );

    // Load existing tasks
    socketRef.current.on("loadTasks", (t) => {
      setTasks(t)
    
  });
    socketRef.current.on("taskAdded", (task) =>
      setTasks((prev) => [...prev, task])
    );
    socketRef.current.on("taskUpdated", (task) =>
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
    );
    socketRef.current.on("taskStatusChanged", (task) =>
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
    );

    setJoined(true);
  };

 

  // 🔹 Notifications
  const showNotification = (message, type) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  // Add task
  const handleSubmit = () => {
    if(!editId){
    if (!title.trim()) return alert("Please enter a task title");
    socketRef.current.emit("addTask", { noteId, title, content });
    setTitle("");
    setContent("");
    }else{  
     
    socketRef.current.emit("updateTask", { taskId, title, content,status });
    }
  };

  // Change status
  // const changeStatus = (taskId, status) => {
  //   socketRef.current.emit("changeStatus", { taskId, status });
  // };

 const updateTask = async (taskId, title, content,status) => {
  
    setTaskId(taskId);
    setTitle(title);
    setContent(content);
     setStatus(status);
     setEditId(taskId);

};
//status change
 const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleChange = (e) => {
  
    socketRef.current.emit("editNote", { noteId, title:title,content: content ,status:status});
    socketRef.current.emit("typing", { noteId, username });
  };

  useEffect(() => {
if (!joined || !socketRef.current) return; 
     socketRef.current.emit("joinNote", { noteId, username });
   socketRef.current.on("loadTasks", (t) => setTasks(t));
   socketRef.current.on("taskAdded", (task) => setTasks((prev) => [...prev, task]));
   socketRef.current.on("taskUpdated", (task) =>
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
    );
    socketRef.current.on("taskStatusChanged", (task) =>
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
    );
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [noteId]);

  // 🔹 UI
  if (!joined) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Join a Note</h2>
        <input
          placeholder="Note ID"
          value={noteId}
          onChange={(e) => setNoteId(e.target.value)}
          
          style={{ marginRight: 10 }}
        />
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <button onClick={joinNote}>Join Note</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, position: "relative" }}>
      <h3>Collaborative Note: {noteId}</h3>

      {/* 🧑 Active Users */}
      <ul>
        {users.map((user, index) => (
          <li
            key={index}
            style={{
              fontWeight: user === username ? "bold" : "normal",
              color: "black",
            }}
          >
            {user}
          </li>
        ))}
      </ul>

      {/* ✅ Task Section */}
      <div>
        <h3>Tasks</h3>
        <input
          value={title}
         onChange={(e) => {
    setTitle(e.target.value);
    handleChange(e.target.value); 
  }}
          placeholder="Title"
        />&nbsp;
        <input
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
             handleChange(e.target.value); 
          }}
          placeholder="Description"
        />&nbsp;
          <select value={status}  onChange={(e) => {
            handleStatusChange();handleChange(e.target.value); 
          }}>
    <option value="In-Progress">In-Progress</option>
    <option value="Done">Done</option>
    <option value="To Do">To Do</option>
  </select>
&nbsp;
        <button onClick={handleSubmit}>
           {editId ? "Update Task" : "Add Task"}
          </button><br/><br/>
         
        <table id="taskTable">
          <thead>
          <tr>
            <th>Task</th>
            <th>Description</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>
                  <b>{task.title}</b>
                </td>
                <td>{task.content}</td>
                <td>{task.status}</td>
                <td>
                  <button onClick={() => updateTask(task.id, task.title,task.content,task.status)}>
                Edit
              </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ⌨️ Typing users */}
      {typingUsers.length > 0 && (
        <p style={{ color: "gray" }}>{typingUsers.join(", ")} is typing...</p>
      )}

      {/* 🔔 Notifications */}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          zIndex: 9999,
        }}
      >
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              backgroundColor: n.type === "join" ? "#d4edda" : "#f8d7da",
              color: n.type === "join" ? "#155724" : "#721c24",
              padding: "10px 16px",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              fontSize: 14,
            }}
          >
            {n.message}
          </div>
        ))}
      </div>
    </div>
  );
}
