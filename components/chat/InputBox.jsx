"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Mic, MicOff, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InputBox({ onSend, disabled = false, voiceManager, voiceEnabled = true }) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [rows, setRows] = useState(1);
  const [voiceError, setVoiceError] = useState(null);
  const textareaRef = useRef();
  const recognitionRef = useRef();

  // Initialize speech recognition
  useEffect(() => {
    setSpeechSupported(voiceManager?.isSupported || false);
  }, [voiceManager]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      const lineHeight = 24;
      const lines = text.split('\n').length;
      const calculatedRows = Math.min(Math.max(lines, 1), 5);
      setRows(calculatedRows);
    }
  }, [text]);

  // Handle text input
  const handleChange = (e) => {
    setText(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!text.trim() || disabled) return;
    
    const messageText = text.trim();
    setText("");
    setRows(1);
    await onSend(messageText);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Toggle speech recognition
  const toggleSpeechRecognition = () => {
    if (!speechSupported || !voiceManager || !voiceEnabled) return;

    if (isListening) {
      voiceManager.stopListening();
      setIsListening(false);
    } else {
      setVoiceError(null);
      const success = voiceManager.startListening(
        (result) => {
          if (result.isFinal) {
            setText(prev => prev ? `${prev} ${result.transcript}` : result.transcript);
            setIsListening(false);
          }
        },
        (error) => {
          setVoiceError(error);
          setIsListening(false);
          console.error("Speech recognition error:", error);
        },
        () => {
          setIsListening(false);
        }
      );
      
      if (success) {
        setIsListening(true);
      } else {
        setVoiceError("Failed to start voice recognition");
      }
    }
  };

  // Predefined quick actions
  const quickActions = [
    "What's the weather like?",
    "Check GitHub stats",
    "Create a todo",
    "What time is it?",
    "Help me with something"
  ];

  const handleQuickAction = (action) => {
    setText(action);
    textareaRef.current?.focus();
  };

  return (
    <div className="space-y-3">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action, index) => (
          <motion.button
            key={action}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleQuickAction(action)}
            className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-full border border-gray-200 hover:border-gray-300 transition-all duration-200"
          >
            {action}
          </motion.button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-end gap-2 p-3 bg-white rounded-2xl border-2 border-gray-200 focus-within:border-blue-500 transition-colors shadow-sm">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            rows={rows}
            placeholder="Ask me anything or give me a task to perform..."
            disabled={disabled}
            className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 resize-none focus:outline-none text-sm leading-6 min-h-[24px] max-h-[120px]"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(0,0,0,0.2) transparent'
            }}
          />

          {/* Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Speech Recognition Button */}
            {speechSupported && voiceEnabled && (
              <motion.div
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={toggleSpeechRecognition}
                  disabled={disabled}
                  className={`
                    w-8 h-8 p-0 rounded-full border transition-all duration-200
                    ${isListening 
                      ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100' 
                      : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <MicOff className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
              </motion.div>
            )}

            {/* Send Button */}
            <motion.div
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="submit"
                disabled={!text.trim() || disabled}
                className={`
                  w-8 h-8 p-0 rounded-full transition-all duration-200
                  ${text.trim() && !disabled
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Input Hints */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Keyboard className="w-3 h-3" />
              Enter to send, Shift+Enter for new line
            </span>
            {speechSupported && voiceEnabled && (
              <span className="flex items-center gap-1">
                <Mic className="w-3 h-3" />
                Voice input supported
              </span>
            )}
          </div>
          <div>
            {text.length}/1000
          </div>
        </div>

        {/* Listening Indicator */}
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-12 left-0 right-0 flex items-center justify-center"
          >
            <div className="bg-red-500 text-white px-3 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-2 bg-white rounded-full"
              />
              Listening...
            </div>
          </motion.div>
        )}

        {/* Voice Error */}
        {voiceError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-12 left-0 right-0 flex items-center justify-center"
          >
            <div className="bg-red-600 text-white px-3 py-2 rounded-full text-sm shadow-lg">
              Voice error: {voiceError}
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
}