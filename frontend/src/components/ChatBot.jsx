import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';
import reactLogo from '../assets/react.svg';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I help with your travel plans?' },
  ]);
  const [input, setInput] = useState('');
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/chat`,
        {
          message: input,
        }
      );
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: response.data.reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Sorry, I had trouble responding. Try again later!',
        },
      ]);
    }

    setInput('');
  };

  return (
    <div className="w-full max-w-md h-full bg-gray-900 shadow-lg p-4 rounded-xl flex flex-col">
      <h2 className="text-2xl font-semibold text-gray-200 text-center justify-center mb-4 flex items-center space-x-2">
        <img src={reactLogo} alt="React Logo" width={30} height={30} />
        <span>Genius Chat</span>
      </h2>

      <div
        ref={messagesContainerRef}
        className="overflow-y-auto flex-1 mb-4 space-y-2 pr-2"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`my-1 max-w-xs break-words ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg'
                  : 'bg-gray-700 text-gray-200 rounded-tl-lg rounded-tr-lg rounded-br-lg'
              } p-2`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center mt-auto">
        <input
          type="text"
          className="flex-1 p-2 rounded-lg bg-gray-800 text-gray-200"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="ml-2 bg-customBlue text-white p-2 rounded-lg"
          onClick={handleSend}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
