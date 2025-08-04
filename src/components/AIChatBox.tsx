import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm your Time2Crack shopping assistant. I can help you with:",
      isUser: false,
      timestamp: new Date(),
    },
    {
      text: "• Cracker recommendations\n• Sweet & dessert suggestions\n• Order planning\n• Celebration advice",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = [
      "Based on your celebration needs, I recommend checking out our premium cracker collection.",
      "I can help you create a shopping plan for your celebration. What's your budget range?",
      "Would you like me to suggest the perfect combination of crackers and sweets for your event?",
      "I noticed you're planning a celebration. We have some amazing deals on fireworks and sweets right now.",
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    setMessages(prev => [...prev, { text: response, isUser: false, timestamp: new Date() }]);
    setIsTyping(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    await generateAIResponse(input);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-96 glass-card z-50 flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-primary-600 dark:bg-primary-800 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <h3 className="font-medium">Time2Crack Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex items-start space-x-2',
                    message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-lg max-w-[80%]',
                    message.isUser
                      ? 'bg-primary-500 text-white'
                      : 'glass'
                  )}>
                    <div className="flex items-center space-x-2 mb-1">
                      {message.isUser ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                      <span className="text-xs opacity-75">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="whitespace-pre-line">{message.text}</p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2"
                >
                  <div className="glass p-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 input"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  className="btn btn-primary p-2 rounded-full"
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-6 p-4 rounded-full shadow-lg z-50 transition-colors',
          isOpen
            ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
            : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600'
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageSquare className="h-6 w-6 text-white" />
        )}
      </motion.button>
    </>
  );
};

export default AIChatBox;