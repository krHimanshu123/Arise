"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MessageSquare, Zap, Brain, Mic } from "lucide-react";

const ChatWindow = dynamic(() => import("@/components/chat/ChatWindow"), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[75vh] bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4" />
        <p className="text-white/60">Loading AI Assistant...</p>
      </div>
    </div>
  )
});

export default function ChatPage() {
  const features = [
    {
      icon: MessageSquare,
      title: "Natural Conversations",
      description: "Chat naturally with AI that understands context and maintains conversation memory"
    },
    {
      icon: Zap,
      title: "Agent Actions",
      description: "Execute tasks like fetching data, managing todos, checking weather, and more"
    },
    {
      icon: Brain,
      title: "Smart Responses",
      description: "Powered by Google's Gemini AI for intelligent and helpful responses"
    },
    {
      icon: Mic,
      title: "Voice Support",
      description: "Use voice input and get audio responses for hands-free interaction"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          AI Assistant
        </h1>
        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-6">
          Your intelligent AI companion with agent capabilities. Ask questions, give commands, 
          and let the AI help you accomplish tasks efficiently.
        </p>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors"
            >
              <feature.icon className="w-8 h-8 text-blue-300 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Chat Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <ChatWindow />
      </motion.div>

      {/* Example Commands */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Example Commands</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "What's the weather in New York?",
            "Fetch GitHub stats for microsoft/vscode",
            "Create a todo: Finish the project",
            "Calculate 15% of 450",
            "What time is it in Tokyo?",
            "Search for JavaScript tutorials"
          ].map((command, index) => (
            <motion.div
              key={command}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
              onClick={() => {
                // You could implement a way to auto-fill these into the chat input
                navigator.clipboard?.writeText(command);
              }}
            >
              <p className="text-white/80 text-sm">&quot;{command}&quot;</p>
            </motion.div>
          ))}
        </div>
        <p className="text-white/50 text-sm mt-4 text-center">
          Click any example to copy it to your clipboard
        </p>
      </motion.div>
    </div>
  );
}