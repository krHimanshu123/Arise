"use client";

import React, { useEffect, useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SignedOut, SignedIn, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { MessageSquare } from "lucide-react";

// Lazy load heavy components
const ATSChecker = lazy(() => import("@/components/ATSChecker/ATSChecker"));
const HeroChatWindow = lazy(() => import("@/components/chat/HeroChatWindow"));

const HeroSection = () => {
  const [atsOpen, setAtsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    // Listen for ATS modal event
    const handler = () => setAtsOpen(true);
    window.addEventListener('open-ats-modal', handler);
    
    return () => {
      window.removeEventListener('open-ats-modal', handler);
    };
  }, []);

  return (
    <>
      {/* Header with Clerk Profile */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-blue-100 shadow-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-blue-900 select-none" style={{letterSpacing:'0.04em'}}>
                Arise
              </span>
            </div>
            
            {/* Clerk Authentication and ATS Button */}
            <div className="flex items-center gap-2">
              {/* AI Chat Button for signed-in users */}
              <SignedIn>
               
              </SignedIn>
              
              <SignedOut>
                <SignInButton>
                  <button className="bg-blue-600 text-white rounded-lg font-medium text-sm h-10 px-4 hover:bg-blue-700 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="bg-blue-700 text-white rounded-lg font-medium text-sm h-10 px-4 hover:bg-blue-800 transition-colors">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                />
              </SignedIn>
            </div>
            
          </div>
        </div>
      </header>

      {/* ATS Modal */}
      <Dialog open={atsOpen} onOpenChange={setAtsOpen}>
        <DialogContent className="max-w-2xl w-full p-0 bg-white border-blue-200 z-[9999]">
          <DialogHeader className="p-6">
            <DialogTitle className="text-blue-700 text-2xl">ATS Resume Score Checker</DialogTitle>
            <DialogDescription className="text-gray-600">Upload your resume to get an instant ATS compatibility score and actionable feedback.</DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-0">
            <Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                <span className="ml-2 text-blue-700">Loading ATS Checker...</span>
              </div>
            }>
              <ATSChecker />
            </Suspense>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Modal */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="max-w-3xl w-full h-[70vh] max-h-[600px] p-0 bg-gradient-to-br from-blue-50 to-white border-blue-200 z-[9999]">
          <DialogHeader className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <DialogTitle className="text-white text-xl flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              AI Career Assistant - Gemini 2.5 Pro
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-sm">
              Get instant help with career advice, resume tips, interview preparation, and more powered by Google's latest Gemini 2.5 Pro AI. Ask me anything!
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 p-4 pt-0 h-full">
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto mb-4"></div>
                  <span className="text-blue-700">Loading AI Assistant...</span>
                </div>
              </div>
            }>
              <div className="h-full bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-lg p-1">
                <div className="h-full bg-white/10 backdrop-blur-sm rounded-lg">
                  <HeroChatWindow />
                </div>
              </div>
            </Suspense>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 bg-white pt-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fadeInUp">
            <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 mb-4">
              Accelerate Your Career with AI
            </h1>
            <p className="text-lg md:text-xl text-blue-700">
              Boost your career prospects with <span className="font-bold text-blue-700">AI-driven resumes</span>, <span className="font-bold text-blue-700">tailored cover letters</span>, and <span className="font-bold text-blue-700">mock test analytics</span>.
            </p>
          </div>
          
          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10 w-full max-w-6xl mx-auto px-2 sm:px-0">
            {/* AI Career Assistant */}
            <SignedIn>
           
            </SignedIn>
            <SignedOut>
              <Link href="/chat" className="w-full">
                <div className="group bg-gradient-to-br from-blue-600 to-purple-600 border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 flex flex-col items-center text-center h-full animate-fadeInUp relative overflow-hidden" style={{animationDelay: '0.05s'}}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 animate-pulse"></div>
                  <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 mb-3 text-white relative z-10" />
                  <span className="font-bold text-base sm:text-lg text-white mb-1 relative z-10">AI Career Assistant</span>
                  <span className="text-blue-100 text-xs sm:text-sm relative z-10">Chat with AI for instant help</span>
                  <div className="absolute top-2 right-2 bg-green-400 text-green-900 text-xs px-2 py-1 rounded-full font-semibold z-10">
                    NEW
                  </div>
                </div>
              </Link>
            </SignedOut>

            {/* Create Resume */}
            <Link href="/resume" className="w-full">
              <div className="group bg-white border border-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 flex flex-col items-center text-center h-full animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-3 text-blue-700 group-hover:text-blue-800 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <path d="M20 8v6M23 11h-6"/>
                </svg>
                <span className="font-bold text-base sm:text-lg text-blue-900 mb-1">Create Resume</span>
                <span className="text-gray-500 text-xs sm:text-sm">AI-optimized, ATS-friendly</span>
              </div>
            </Link>

            {/* Generate Cover Letter */}
            <Link href="/ai-cover-letter" className="w-full">
              <div className="group bg-white border border-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 flex flex-col items-center text-center h-full animate-fadeInUp" style={{animationDelay: '0.15s'}}>
                <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-3 text-blue-700 group-hover:text-blue-800 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2z"/>
                  <path d="M7 10h10M7 14h5"/>
                </svg>
                <span className="font-bold text-base sm:text-lg text-blue-900 mb-1">Generate Cover Letter</span>
                <span className="text-gray-500 text-xs sm:text-sm">Personalized for every job</span>
              </div>
            </Link>

            {/* Mock Preparation App */}
            <Link href="/interview/mock" className="w-full">
              <div className="group bg-white border border-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 flex flex-col items-center text-center h-full animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-3 text-blue-700 group-hover:text-blue-800 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2h5"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span className="font-bold text-base sm:text-lg text-blue-900 mb-1">Mock Preparation App</span>
                <span className="text-gray-500 text-xs sm:text-sm">Practice with real questions</span>
              </div>
            </Link>

            {/* GitHub Readme Generator */}
            <Link href="/readme-generator" className="w-full">
              <div className="group bg-white border border-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 flex flex-col items-center text-center h-full animate-fadeInUp" style={{animationDelay: '0.25s'}}>
                <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-3 text-blue-700 group-hover:text-blue-800 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 20h9"/>
                  <path d="M12 4h9"/>
                  <rect x="3" y="8" width="13" height="8" rx="2"/>
                </svg>
                <span className="font-bold text-base sm:text-lg text-blue-900 mb-1">GitHub Readme Generator</span>
                <span className="text-gray-500 text-xs sm:text-sm">Showcase skills & projects</span>
              </div>
            </Link>

            {/* ATS Score Checker */}
            <button
              className="group w-full bg-white border border-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 flex flex-col items-center text-center h-full animate-fadeInUp"
              onClick={() => setAtsOpen(true)}
              style={{animationDelay: '0.3s'}}
            >
              <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-3 text-blue-700 group-hover:text-blue-800 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="font-bold text-base sm:text-lg text-blue-900 mb-1">ATS Score Checker</span>
              <span className="text-gray-500 text-xs sm:text-sm">Instant feedback & tips</span>
            </button>

            {/* Dashboard */}
            <Link href="/dashboard" className="w-full">
              <div className="group bg-white border border-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 flex flex-col items-center text-center h-full animate-fadeInUp" style={{animationDelay: '0.35s'}}>
                <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-3 text-blue-700 group-hover:text-blue-800 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <rect x="9" y="9" width="6" height="6"/>
                  <path d="M9 1v6M15 1v6M9 17v6M15 17v6M1 9h6M1 15h6M17 9h6M17 15h6"/>
                </svg>
                <span className="font-bold text-base sm:text-lg text-blue-900 mb-1">Dashboard</span>
                <span className="text-gray-500 text-xs sm:text-sm">Manage your career tools</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
