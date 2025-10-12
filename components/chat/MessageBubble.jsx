"use client";

import { motion } from "framer-motion";
import { User, Bot, AlertCircle } from "lucide-react";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const isError = message.isError;
  const isActionResult = message.isActionResult;

  const bubbleVariants = {
    initial: { opacity: 0, scale: 0.8, y: 10 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  const avatarVariants = {
    initial: { scale: 0 },
    animate: { 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: 0.1
      }
    }
  };

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <motion.div
        variants={avatarVariants}
        initial="initial"
        animate="animate"
        className={`
          flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-sm
          ${isUser 
            ? 'bg-blue-600 border-blue-500' 
            : isError
            ? 'bg-red-500 border-red-400'
            : 'bg-gray-600 border-gray-500'
          }
        `}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : isError ? (
          <AlertCircle className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </motion.div>

      {/* Message Content */}
      <motion.div
        variants={bubbleVariants}
        initial="initial"
        animate="animate"
        className={`
          max-w-[75%] rounded-2xl px-4 py-3 shadow-sm
          ${isUser
            ? 'bg-blue-600 text-white rounded-br-md'
            : isError
            ? 'bg-red-50 text-red-800 rounded-bl-md border border-red-200'
            : isActionResult
            ? 'bg-green-50 text-green-800 rounded-bl-md border border-green-200'
            : 'bg-gray-100 text-gray-900 rounded-bl-md border border-gray-200'
          }
        `}
      >
        {/* Message Text */}
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.text}
        </div>

        {/* Timestamp */}
        <div className={`mt-2 text-xs ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>

        {/* Special indicators */}
        {isActionResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 flex items-center gap-1 text-xs text-green-600"
          >
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Action Result
          </motion.div>
        )}

        {isError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 flex items-center gap-1 text-xs text-red-300"
          >
            <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
            Error
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}