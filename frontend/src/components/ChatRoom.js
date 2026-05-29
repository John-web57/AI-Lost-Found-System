import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

function ChatRoom() {
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/chat/messages")
      .then((res) => setMessages(res.data))
      .catch((err) => {
        console.error(err);
        setError("Unable to load chat history.");
      });

    socket.on("newMessage", (message) => {
      setMessages((current) => [...current, message]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!text.trim()) {
      return;
    }

    socket.emit("sendMessage", {
      username: username.trim() || "Anonymous",
      text: text.trim(),
    });

    setText("");
  };

  return (
    <section className="chat-room">
      <div className="chat-header">
        <h2>Live Chat</h2>
        <p>Connect with other users in real time while reporting lost and found items.</p>
      </div>

      {error && <p className="empty-state">{error}</p>}

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message._id} className="chat-message">
            <span className="chat-meta">
              <strong>{message.username}</strong>
              <time>{new Date(message.date).toLocaleTimeString()}</time>
            </span>
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <div className="chat-inputs">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your name"
          />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
          />
        </div>
        <button type="submit">Send</button>
      </form>
    </section>
  );
}

export default ChatRoom;
