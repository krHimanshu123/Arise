"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";
import InputBox from "./InputBox";
import TaskCard from "./TaskCard";
import { runAction } from "@/lib/chat-actions";
import { getVoiceManager, voiceUtils } from "@/lib/voice-manager";
import { Button } from "@/components/ui/button";
import { Trash2, Download, Volume2, VolumeX, ExternalLink } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "arise_chat_history_v1";

export default function HeroChatWindow() {
  const [messages, setMessages] = useState([]);
  const [taskQueue, setTaskQueue] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false); // Disabled by default in hero
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef();
  const messagesContainerRef = useRef();
  const voiceManager = useRef(null);

  // Initialize voice manager
  useEffect(() => {
    voiceManager.current = getVoiceManager();
    
    return () => {
      if (voiceManager.current) {
        voiceManager.current.destroy();
      }
    };
  }, []);

  // Load conversation history
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only show last 10 messages in hero view
        setMessages(parsed.slice(-10));
      } else {
        // Initialize with welcome message
        const welcomeMsg = {
          id: Date.now(),
          role: "assistant",
          text: "👋 Welcome to your AI Career Assistant powered by Gemini 2.5 Pro! I can help you with:\n\n• Resume and cover letter advice\n• Interview preparation tips\n• Career guidance and planning\n• GitHub repository analysis\n• Weather updates\n• Todo management\n\nWhat would you like to know?",
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMsg]);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  }, []);

  // Save conversation history
  useEffect(() => {
    if (messages.length > 0) {
      try {
        // Get full history from storage and append new messages
        const saved = localStorage.getItem(STORAGE_KEY);
        const fullHistory = saved ? JSON.parse(saved) : [];
        
        // Merge and deduplicate messages
        const allMessages = [...fullHistory, ...messages.filter(msg => 
          !fullHistory.some(existing => existing.id === msg.id)
        )];
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allMessages));
      } catch (error) {
        console.error("Failed to save chat history:", error);
      }
    }
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  // Send message to AI
  async function handleSend(text) {
    if (!text?.trim()) return;

    const userMsg = {
      id: Date.now() + "-user",
      role: "user",
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          maxTokens: 800, // Shorter responses for hero
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const assistantText = data?.output || data?.content || "I apologize, but I couldn't generate a response.";

      // Check if response is an action directive
      let actionDirective = null;
      try {
        const cleaned = assistantText.trim();
        if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
          const parsed = JSON.parse(cleaned);
          if (parsed.type === "action" && parsed.action && parsed.params) {
            actionDirective = parsed;
          }
        }
      } catch (e) {
        // Not JSON, treat as regular response
      }

      if (actionDirective) {
        // Handle action execution
        const intentMsg = {
          id: Date.now() + "-intent",
          role: "assistant",
          text: `🤖 Executing: ${actionDirective.action.replace(/_/g, ' ')}...`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, intentMsg]);

        // Create and run task
        const taskId = Date.now() + "-task";
        const newTask = {
          id: taskId,
          action: actionDirective.action,
          params: actionDirective.params,
          status: "pending",
          result: null,
          timestamp: new Date().toISOString()
        };

        setTaskQueue(prev => [...prev, newTask]);

        // Update task status to running
        setTaskQueue(prev => prev.map(t => 
          t.id === taskId ? { ...t, status: "running" } : t
        ));

        try {
          const actionResult = await runAction(actionDirective.action, actionDirective.params);
          
          // Update task with result
          setTaskQueue(prev => prev.map(t => 
            t.id === taskId ? { ...t, status: "completed", result: actionResult } : t
          ));

          // Add result message
          const resultMsg = {
            id: Date.now() + "-result",
            role: "assistant",
            text: formatActionResult(actionDirective.action, actionResult),
            timestamp: new Date().toISOString(),
            isActionResult: true
          };
          setMessages(prev => [...prev, resultMsg]);

        } catch (actionError) {
          setTaskQueue(prev => prev.map(t => 
            t.id === taskId ? { ...t, status: "failed", result: { error: actionError.message } } : t
          ));

          const errorMsg = {
            id: Date.now() + "-error",
            role: "assistant", 
            text: `❌ Failed to execute ${actionDirective.action}: ${actionError.message}`,
            timestamp: new Date().toISOString(),
            isError: true
          };
          setMessages(prev => [...prev, errorMsg]);
        }
      } else {
        // Regular conversation response
        const aiMsg = {
          id: Date.now() + "-assistant",
          role: "assistant",
          text: assistantText,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMsg]);

        // Speak the response if voice is enabled
        if (voiceEnabled && voiceManager.current && voiceUtils.shouldSpeak(assistantText)) {
          const speechText = voiceUtils.formatForSpeech(assistantText);
          voiceManager.current.speak(speechText, {
            onStart: () => setIsSpeaking(true),
            onEnd: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false)
          });
        }
      }

      setIsConnected(true);
    } catch (error) {
      console.error("Chat error:", error);
      setIsConnected(false);
      
      let errorMessage = "❌ I'm having trouble connecting right now. Please try again.";
      
      // Provide specific error messages based on error type
      if (error.message?.includes('401')) {
        errorMessage = "❌ Authentication failed. Please check the API configuration.";
      } else if (error.message?.includes('429')) {
        errorMessage = "❌ Too many requests. Please wait a moment and try again.";
      } else if (error.message?.includes('500')) {
        errorMessage = "❌ Server error. The AI service is temporarily unavailable.";
      } else if (error.message?.includes('model')) {
        errorMessage = "❌ AI model unavailable. Please try again later.";
      } else if (!navigator.onLine) {
        errorMessage = "❌ No internet connection. Please check your network and try again.";
      }
      
      const errorMsg = {
        id: Date.now() + "-error",
        role: "assistant",
        text: errorMessage,
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  // Format action results for display
  function formatActionResult(action, result) {
    if (result?.error) {
      return `❌ ${action.replace(/_/g, ' ')} failed: ${result.error}`;
    }

    switch (action) {
      case "fetch_weather":
        if (result?.main && result?.weather) {
          return `🌤️ Weather in ${result.name}: ${result.weather[0].description}, ${Math.round(result.main.temp)}°C (feels like ${Math.round(result.main.feels_like)}°C)`;
        }
        break;
      case "fetch_github_stats":
        if (result?.name) {
          return `📊 ${result.name}: ${result.stargazers_count} stars, ${result.forks_count} forks, ${result.open_issues_count} open issues. ${result.description || ''}`;
        }
        break;
      case "create_todo":
        if (result?.id) {
          return `✅ Todo created: "${result.title}"`;
        }
        break;
      case "get_time":
        return `🕐 Current time: ${result.time}`;
      case "calculate":
        return `🧮 Result: ${result.result}`;
      default:
        return `✅ ${action.replace(/_/g, ' ')} completed: ${typeof result === 'string' ? result : JSON.stringify(result)}`;
    }

    return `✅ ${action.replace(/_/g, ' ')} completed successfully`;
  }

  // Clear chat history
  function clearChat() {
    setMessages([]);
    setTaskQueue([]);
    const welcomeMsg = {
      id: Date.now(),
      role: "assistant",
      text: "👋 Welcome to your AI Career Assistant! I can help you with resume advice, interview prep, career guidance, and more. What would you like to know?",
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMsg]);
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/chat">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              title="Open full chat"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-3 bg-white min-h-0 chat-messages"
        style={{ maxHeight: "350px" }}
      >
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ 
                duration: 0.2,
                type: "spring",
                stiffness: 150,
                damping: 20
              }}
            >
              <MessageBubble message={message} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 p-3"
          >
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm text-gray-600">AI is thinking...</span>
          </motion.div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Active Tasks */}
      {taskQueue.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50 max-h-32 overflow-y-auto">
          <div className="space-y-2">
            {taskQueue.slice(-2).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <InputBox 
          onSend={handleSend} 
          disabled={isTyping} 
          voiceManager={voiceManager.current}
          voiceEnabled={voiceEnabled}
        />
        <div className="mt-2 text-center">
          <Link 
            href="/chat"
            className="text-xs text-gray-500 hover:text-blue-600 underline"
          >
            Open full chat experience →
          </Link>
        </div>
      </div>
    </div>
  );
}