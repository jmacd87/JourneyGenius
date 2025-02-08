import React from 'react';
import { MessageSquare } from 'lucide-react';

const ChatBubble = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 z-50 p-3 bg-blue-500 rounded-full shadow-lg text-white flex items-center justify-center text-xl hover:bg-blue-400 transition duration-300"
      aria-label="Chat with us"
    >
      <MessageSquare size={24} />
    </button>
  );
};

export default ChatBubble;
