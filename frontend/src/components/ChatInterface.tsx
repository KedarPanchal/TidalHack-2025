import React, { useState, useRef, useEffect } from 'react';
import { useChatRequest, useRAGRequest, type ChatPersona } from '../hooks/useapihelpers';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  persona: ChatPersona;
  enableRAG?: boolean;
  context?: string;
  placeholder?: string;
  className?: string;
}

export default function ChatInterface({ 
  persona, 
  enableRAG = false, 
  context = '', 
  placeholder = "Type your message...",
  className = ""
}: ChatInterfaceProps) {
  // Generate unique storage key for this persona
  const storageKey = `chat-history-${persona}`;
  
  // Load messages from localStorage on component mount
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.warn('Failed to load chat history:', error);
    }
    return [];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  
  // Use appropriate hook based on RAG requirement
  const chatHook = useChatRequest();
  const ragHook = useRAGRequest();
  
  const { sendRequest: chatSendRequest, loading: chatLoading, error: chatError } = chatHook;
  const { sendRequest: ragSendRequest, loading: ragLoading, error: ragError } = ragHook;
  
  const loading = enableRAG ? ragLoading : chatLoading;
  const error = enableRAG ? ragError : chatError;

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (error) {
      console.warn('Failed to save chat history:', error);
    }
  }, [messages, storageKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll to bottom only if user hasn't manually scrolled up
  useEffect(() => {
    if (!isUserScrolling) {
      scrollToBottom();
    }
  }, [messages, isUserScrolling]);

  // Detect if user is manually scrolling
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
    setIsUserScrolling(!isAtBottom);
  };

  // Filter messages based on search query
  const filteredMessages = messages.filter(message => 
    searchQuery === '' || 
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      let response;
      if (enableRAG && context) {
        response = await ragSendRequest(persona, inputValue.trim(), context);
      } else {
        response = await chatSendRequest(persona, inputValue.trim());
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message || response.response || JSON.stringify(response),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error processing your request. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearMessages = () => {
    setMessages([]);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to clear chat history:', error);
    }
  };


  return (
    <div className={`flex flex-col h-full bg-background ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <h3 className="font-semibold text-foreground capitalize">{persona} Chat</h3>
          {messages.length > 0 && (
            <span className="text-xs text-muted-foreground">
              ({messages.length} messages)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            title="Search chat history"
          >
            🔍
          </button>
          <button
            onClick={clearMessages}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            title="Clear chat history"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="px-4 py-2 border-b border-border bg-muted/50">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chat history..."
              className="flex-1 px-3 py-1 text-sm border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSearch(false);
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
          {searchQuery && (
            <p className="text-xs text-muted-foreground mt-1">
              Found {filteredMessages.length} of {messages.length} messages
            </p>
          )}
        </div>
      )}

      {/* Messages Container */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onScroll={handleScroll}
      >
        {filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-muted-foreground">
                {searchQuery ? `No messages found for "${searchQuery}"` : `Start a conversation with ${persona}`}
              </p>
            </div>
          </div>
        ) : (
          filteredMessages.map((message) => {
            // Highlight search terms
            const highlightText = (text: string, query: string) => {
              if (!query) return text;
              const regex = new RegExp(`(${query})`, 'gi');
              const parts = text.split(regex);
              return parts.map((part, index) => 
                regex.test(part) ? (
                  <mark key={index} className="bg-yellow-200 dark:bg-yellow-800">{part}</mark>
                ) : part
              );
            };

            return (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {highlightText(message.content, searchQuery)}
                  </p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
        
        {/* Scroll to Bottom Button */}
        {isUserScrolling && (
          <button
            onClick={() => {
              setIsUserScrolling(false);
              scrollToBottom();
            }}
            className="fixed bottom-20 right-4 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 transition-colors z-10"
            title="Scroll to bottom"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20">
          <p className="text-sm text-destructive">
            Error: {error.message}
          </p>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={loading}
            className="flex-1 min-h-[40px] max-h-32 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        {enableRAG && context && (
          <p className="text-xs text-muted-foreground mt-2">
            RAG enabled with context: {context.substring(0, 50)}...
          </p>
        )}
      </div>
    </div>
  );
}
