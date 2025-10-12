"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import dynamic from "next/dynamic";
import "./chat/chat-styles.css";

const HeroChatWindow = dynamic(() => import("@/components/chat/HeroChatWindow"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-blue-600">Loading AI Assistant...</p>
      </div>
    </div>
  )
});

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 lg:bottom-12 lg:right-12 z-40"
      >
        <SignedIn>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="bg-white text-blue-600 p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group border border-blue-100"
          >
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
            
            {/* Subtle pulse animation */}
            <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-10" />
            
            {/* Professional tooltip */}
            <div className="absolute bottom-full right-0 mb-3 px-2 sm:px-3 py-1 sm:py-2 bg-gray-900 text-white text-xs sm:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-lg transform group-hover:-translate-y-1">
              Chat with AI Assistant
              <div className="absolute top-full right-2 sm:right-3 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900"></div>
            </div>
          </motion.button>
        </SignedIn>

        <SignedOut>
          <Link href="/chat">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group border border-blue-100"
            >
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
              
              {/* Subtle pulse animation */}
              <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-10" />
              
              {/* Professional tooltip */}
              <div className="absolute bottom-full right-0 mb-3 px-2 sm:px-3 py-1 sm:py-2 bg-gray-900 text-white text-xs sm:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-lg transform group-hover:-translate-y-1">
                Chat with AI Assistant
                <div className="absolute top-full right-2 sm:right-3 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900"></div>
              </div>
            </motion.button>
          </Link>
        </SignedOut>
      </motion.div>

      {/* Professional Chat Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="chat-dialog-content max-w-sm sm:max-w-md lg:max-w-lg w-[95vw] sm:w-[400px] lg:w-[420px] h-[80vh] sm:h-[70vh] lg:h-[600px] max-h-[600px] p-0 bg-white border-gray-200 shadow-2xl rounded-lg">
          <DialogHeader className="p-3 sm:p-4 bg-white border-b border-gray-100 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-gray-900 text-sm sm:text-lg font-semibold truncate">AI Career Assistant</DialogTitle>
                  <p className="text-gray-500 text-xs hidden sm:block">Powered by Gemini 2.5 Pro</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 sm:p-2 h-auto rounded-full flex-shrink-0"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 h-full bg-white overflow-hidden rounded-b-lg">
            <HeroChatWindow />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}