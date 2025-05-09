import { useState } from "react";
import axios from "axios";
import Sidebar from "../sidebar/sidebar";

function ChatBot() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]); // Stores chat history

  const handleSend = async () => {
    if (!message.trim()) return;

    // Append user's message to conversation history
    const newConversation = [...conversation, { role: "user", content: message }];
    setConversation(newConversation);
    setMessage(""); // Clear input

    try {
      const response = await axios.post("http://localhost:5000/api/chat", { message });
      const botReply = response.data.choices[0].message.content;

      // Append bot's reply to conversation history with improved formatting
      setConversation([
        ...newConversation,
        { role: "bot", content: formatBotMessage(botReply) }
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setConversation([...newConversation, { role: "bot", content: "Sorry, something went wrong." }]);
    }
  };

  // Function to format AI messages (Markdown-style)
  const formatBotMessage = (message) => {
    return message
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold formatting
      .replace(/\n/g, "<br />"); // Line breaks
  };

  // Handle "Enter" key submission
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a23] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Chat Area */}
      <div className="flex flex-col flex-grow p-8">
        <h2 className="text-3xl font-bold mb-6">💬 Illura Chatbot</h2>

        {/* Chat History */}
        <div className="mb-4 p-4 bg-[#1f1f3a] rounded-lg border border-[#5E66FF] h-[400px] overflow-y-auto">
          {conversation.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 p-3 rounded-lg ${
                msg.role === "user" ? "bg-[#2a2a4a] text-right" : "bg-[#1b1b35]"
              }`}
              dangerouslySetInnerHTML={{ __html: msg.content }} // Apply formatted AI message
            />
          ))}
        </div>

        {/* Input Area */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown} // Listen for "Enter" key
            placeholder="Ask something..."
            className="flex-grow p-3 rounded-lg bg-[#1f1f3a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5E66FF]"
          />
          <button
            onClick={handleSend}
            className="px-6 py-3 rounded-lg bg-[#5E66FF] hover:bg-[#4b55e1] transition-colors font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
