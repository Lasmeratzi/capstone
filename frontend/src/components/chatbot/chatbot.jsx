import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../sidebar/sidebar";
import { useNavigate } from "react-router-dom";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

function ChatBot() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;

    const newConversation = [...conversation, { role: "user", content: message }];
    setConversation(newConversation);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        messages: newConversation.map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        })),
      });
      const botReply = response.data?.choices?.[0]?.message?.content || "Sorry, no response.";

      setConversation([
        ...newConversation,
        { role: "bot", content: formatBotMessage(botReply) },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setConversation([
        ...newConversation,
        { role: "bot", content: "Sorry, something went wrong." },
      ]);
    }
  };

  const formatBotMessage = (message) =>
    message.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br />");

  const handleKeyDown = (event) => {
    if (event.key === "Enter") handleSend();
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white text-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Chat Area with transition */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col flex-grow px-8 pb-4 pt-5 relative"
      >
        {/* Title */}
<div className="flex items-center mb-2 space-x-3">
  <img src="/illura.png" alt="Illura Logo" className="h-10" />
  <h2 className="text-2xl font-bold tracking-wide text-[#5E66FF]">
    Chatbot Assistance
  </h2>
  <div className="flex items-center space-x-2 ml-2">
    <span className="text-sm text-gray-500 font-normal">
      Powered by 
    </span>
    <span className="text-sm text-gray-500 font-normal">
      <img src="/Qwen.png" alt="Qwen Logo" className="h-6" />
    </span>
    <span className="text-sm text-gray-500 font-normal">
      Qwen3 235B A22B
    </span>
  </div>
</div>


        <div className="border-b border-gray-300 mb-6 w-full" />

        {/* Chat History */}
        <div className="flex flex-col flex-grow space-y-4 overflow-y-auto pb-36">
          {conversation.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-3xl px-4 py-3 rounded-xl transition-all leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-100 text-right"
                    : "bg-gray-100 text-left"
                }`}
                dangerouslySetInnerHTML={{ __html: msg.content }}
              />
            </div>
          ))}
        </div>

       {/* Input Area */}
<div className="flex justify-center mt-auto">
  <div className="flex flex-col items-center w-full max-w-xl mx-auto">
    {/* Input Field */}
    <div className="flex items-center bg-gray-100 px-5 py-3 rounded-full shadow w-full border border-gray-300">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-grow bg-transparent border-none text-gray-800 placeholder-gray-500 focus:outline-none px-2"
      />
      <button
        onClick={handleSend}
        className="ml-4 p-2 rounded-full bg-[#5E66FF] hover:bg-[#4b55e1] transition font-semibold shadow flex items-center justify-center"
      >
        <PaperAirplaneIcon className="h-5 w-5 text-white" />
      </button>
    </div>
{/* AI Disclaimer Below Input Field */}
<p className="mt-2 text-xs text-gray-500 text-center">
  Illura Chatbot uses AI to generate responses automatically. While we aim for accuracy, please verify important details as information may be incomplete or incorrect.
</p>
  </div>
</div>
      </motion.div>

      {/* Right Sidebar */}
<div className="w-80 py-6 pr-10">
  <div
    className="flex items-center mb-6 cursor-pointer"
    onClick={() => navigate("/profile")}
  >
    {user.pfp ? (
      <img
        src={`http://localhost:5000/uploads/${user.pfp}`}
        alt="Profile"
        className="w-12 h-12 rounded-full border border-gray-300"
      />
    ) : (
      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
        <span className="text-gray-600 text-sm">N/A</span>
      </div>
    )}
    <div className="ml-3">
      <p className="font-bold">{user.username}</p>
      <p className="text-gray-500 text-sm">{user.fullname}</p>
    </div>
  </div>

  {/* Mini Footer */}
  <div className="mt-10 text-xs text-gray-400 space-y-1">
    <p>About • Help • Privacy • Terms</p>
    <p>© 2025 Illura</p>
  </div>
</div>

    </div>
  );
}

export default ChatBot;
