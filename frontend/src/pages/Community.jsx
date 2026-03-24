import { useEffect, useState } from "react";

function Community() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchMessages = () => {
    fetch(`http://127.0.0.1:8000/community/${user.email}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setMessages(data))
      .catch(() => {
        alert("Only subscribers can access community");
      });
  };

  useEffect(() => {
    if (user) fetchMessages();
  }, []);

  const postMessage = async () => {
    if (!text.trim()) return;

    const res = await fetch("http://127.0.0.1:8000/community/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: user.email,
        text
      })
    });

    if (!res.ok) {
      alert("Only subscribers can post");
      return;
    }

    setText("");
    fetchMessages();
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">

      <h2 className="text-2xl font-bold mb-6">
        Subscriber Community 💬
      </h2>

      {/* INPUT */}
      <div className="flex gap-2 mb-6">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 flex-1 rounded"
          placeholder="Share your thoughts..."
        />

        <button
          onClick={postMessage}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Post
        </button>
      </div>

      {/* MESSAGES */}
      <div className="space-y-3">

        {messages.length === 0 && (
          <p className="text-gray-500">
            No messages yet
          </p>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="border p-3 rounded bg-white shadow">

            <p className="text-sm text-gray-500">
              {msg.user} • {msg.time}
            </p>

            <p className="mt-1">{msg.text}</p>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Community;